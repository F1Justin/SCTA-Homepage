"""Rebuild local WOFF2 subsets with FontTools and Brotli.

The normal site build uses the committed assets. The full faces still cover
characters added after the subsets were generated.
"""
import argparse
import hashlib
import re
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / "src/styles/type"
NOTO_SHA256 = "a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da"


def build(source, filename, characters, family, postscript_name):
    font = TTFont(source, recalcTimestamp=False)
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes={ord(character) for character in characters})
    sub.subset(font)
    for record in font["name"].names:
        names = {1: family, 3: postscript_name, 4: family, 6: postscript_name, 16: family}
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    font.flavor = "woff2"
    output = DESTINATION / filename
    font.save(output)
    print(f"{output.name}: {len(font.getBestCmap())} codepoints, {output.stat().st_size:,} bytes")


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("noto_source", type=Path, help="Google Fonts Noto Sans SC 2.004-H2 variable TTF")
args = parser.parse_args()
if hashlib.sha256(args.noto_source.read_bytes()).hexdigest() != NOTO_SHA256:
    parser.error("Noto source does not match the documented 2.004-H2 build")

common = "".join(chr(codepoint) for codepoint in range(32, 127))
site_text = common + "".join(
    file.read_text(encoding="utf-8")
    for pattern in ("messages/*.json", "content/**/*.md", "src/**/*.ts", "src/**/*.tsx")
    for file in ROOT.glob(pattern)
)
cover_text = common + "".join(
    title
    for file in (ROOT / "content/blueprints").glob("*.md")
    for title in re.findall(r"^title:\s*(.+)$", file.read_text(encoding="utf-8"), re.MULTILINE)
)
build(args.noto_source, "SctaText.woff2", site_text, "SCTA Text", "SCTAText")
build(ROOT / "public/fonts/SmileySans-Oblique.ttf", "SctaCovers.woff2", cover_text, "SCTA Covers", "SCTACovers")
