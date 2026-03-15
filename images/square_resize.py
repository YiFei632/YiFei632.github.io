#!/usr/bin/env python3
import argparse
from pathlib import Path
from PIL import Image

def next_available(path: Path) -> Path:
    """避免已有 .raw 冲突：.raw, .raw1, .raw2 ..."""
    if not path.exists():
        return path
    base, suf = path.stem, path.suffix
    n = 1
    while True:
        cand = path.with_name(f"{base}{n}{suf}")
        if not cand.exists():
            return cand
        n += 1

def to_square_size(w: int, h: int, mode: str, fixed: int | None) -> tuple[int, int]:
    if fixed is not None:
        return (fixed, fixed)
    if mode == "long":
        m = max(w, h)
    elif mode == "short":
        m = min(w, h)
    else:
        m = max(w, h)
    return (m, m)

def process_one(img_path: Path, mode: str, fixed: int | None, dry: bool=False):
    # 跳过已经是 .raw 的备份
    if img_path.stem.endswith(".raw"):
        return

    try:
        with Image.open(img_path) as im:
            w, h = im.size
            if w == h:
                print(f"[SKIP] 已是1:1  -> {img_path}")
                return

            # 目标尺寸（非等比，同步压缩/拉伸至正方形）
            new_w, new_h = to_square_size(w, h, mode, fixed)

            # 选择兼容的重采样枚举
            Resampling = getattr(Image, "Resampling", Image)
            new_im = im.resize((new_w, new_h), resample=Resampling.LANCZOS)

            # 先把老图改名为 *.raw.*
            raw_path = img_path.with_name(f"{img_path.stem}.raw{img_path.suffix}")
            raw_path = next_available(raw_path)

            if dry:
                print(f"[DRY-RUN] {img_path} -> {raw_path} (backup) ; 写入新图至原名 {img_path}")
                return

            img_path.rename(raw_path)

            # 保留 EXIF（若有）
            save_kwargs = {}
            if img_path.suffix.lower() in (".jpg", ".jpeg"):
                exif = im.info.get("exif")
                if exif:
                    save_kwargs["exif"] = exif
                # 稳妥的 JPEG 保存参数
                save_kwargs.setdefault("quality", 95)
                save_kwargs.setdefault("subsampling", 0)

            new_im.save(img_path, **save_kwargs)
            print(f"[OK] {raw_path.name} -> {img_path.name}  [{w}x{h} => {new_w}x{new_h}]")

    except Exception as e:
        print(f"[ERR] {img_path} : {e}")

def main():
    parser = argparse.ArgumentParser(
        description="递归将 png/jpg 图片拉伸/压缩为 1:1，并把原图备份为 *.raw.*"
    )
    parser.add_argument(
        "--mode", choices=["long", "short"], default="long",
        help="目标边长策略：long=对齐长边(默认)，short=对齐短边"
    )
    parser.add_argument(
        "--size", type=int, default=None,
        help="固定边长（如 1024）；若设置，则忽略 --mode"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="只打印将要进行的操作，不实际修改"
    )
    parser.add_argument(
        "--ext", nargs="*", default=[".png", ".jpg", ".jpeg"],
        help="要处理的扩展名（不区分大小写），默认 .png .jpg .jpeg"
    )
    args = parser.parse_args()

    exts = {e.lower() if e.startswith(".") else f".{e.lower()}" for e in args.ext}

    for p in Path(".").rglob("*"):
        if p.is_file() and p.suffix.lower() in exts:
            process_one(p, mode=args.mode, fixed=args.size, dry=args.dry_run)

if __name__ == "__main__":
    main()
