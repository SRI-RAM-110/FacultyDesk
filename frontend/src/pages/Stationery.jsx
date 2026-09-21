import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Stationery.css";

// Complete NEC stationery list: 197 entries.
// Prices are INR estimates where the supplied source did not specify a price.
const STATIONERY_ITEMS = [
  {
    "id": 1,
    "sourceNo": 1,
    "name": "APSARA PLATINUM PENCILS ( 1 box 10No's )",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 58
  },
  {
    "id": 2,
    "sourceNo": 2,
    "name": "CAMEL PENCIL WITH ERASER",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 6
  },
  {
    "id": 3,
    "sourceNo": 3,
    "name": "APSARA NON DUST ERASER",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 4,
    "sourceNo": 4,
    "name": "NATRAJ SHARPNER",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 5,
    "sourceNo": 5,
    "name": "NATRAJ ERASER",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 6,
    "sourceNo": 6,
    "name": "SAINO STAR FLOW BALL PENS",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 7,
    "sourceNo": 7,
    "name": "SAINO SOFT TEC TRIO BALL PENS BLUE",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 8,
    "sourceNo": 8,
    "name": "SPEED BLUE PENS",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 9,
    "sourceNo": 9,
    "name": "SPEED BLACK PENS",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 10,
    "sourceNo": 10,
    "name": "SPEED RED PENS",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 11,
    "sourceNo": 11,
    "name": "NATARAJ PENS JOR",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 12,
    "sourceNo": 12,
    "name": "ADD GEL PENS GREEN",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 13,
    "sourceNo": 13,
    "name": "ADD GEL REFILLS GREEN GR-20",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 14,
    "sourceNo": 14,
    "name": "ADD GEL PENS BLUE",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 15,
    "sourceNo": 15,
    "name": "ADD GEL PENS BLACK",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 16,
    "sourceNo": 16,
    "name": "ADD GEL PENS RED",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 17,
    "sourceNo": 17,
    "name": "ADD GEL PIN - GEL GREEN",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 18,
    "sourceNo": 18,
    "name": "ADD GEL PIN - GEL RED",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 19,
    "sourceNo": 19,
    "name": "LINC OCEAN GEL PENS BLUE ( 1Packet = 3 Nos)",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 20,
    "sourceNo": 20,
    "name": "LINC OCEAN GEL PENS BLACK ( 1Packet = 3 Nos)",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 21,
    "sourceNo": 21,
    "name": "LINC OCEAN GEL PENS RED ( 1Packet = 3 Nos)",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 22,
    "sourceNo": 22,
    "name": "LINC OCEAN GEL PENS GREEN ( 1Packet = 3 Nos)",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 23,
    "sourceNo": 23,
    "name": "UNI BALL PENS GREEN",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 24,
    "sourceNo": 24,
    "name": "UNI BALL PENS BLACK",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 25,
    "sourceNo": 25,
    "name": "CAMEL OHP CD MARKER BLUE (1 BOX = 10 NO'S )",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 26,
    "sourceNo": 26,
    "name": "CAMEL OHP CD MARKER BLACK (1 BOX = 10 NO'S )",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 27,
    "sourceNo": 27,
    "name": "CAMEL OHP CD MARKER RED (1 BOX = 10 NO'S )",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 28,
    "sourceNo": 28,
    "name": "CAMEL OHP CD MARKER GREEN (1 BOX = 10 NO'S )",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 29,
    "sourceNo": 29,
    "name": "CAMEL PERMANENT MARKER RED",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 30,
    "sourceNo": 30,
    "name": "CAMEL PERMANENT MARKER BLUE",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 31,
    "sourceNo": 31,
    "name": "CAMEL PERMANENT MARKER BLACK",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 32,
    "sourceNo": 32,
    "name": "CAMEL WHITE BOARD MARKER PENS BLUE",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 33,
    "sourceNo": 33,
    "name": "CAMEL WHITE BOARD MARKER PENS BLACK",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 34,
    "sourceNo": 34,
    "name": "CAMEL WHITE BOARD MARKER PENS RED",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 35,
    "sourceNo": 35,
    "name": "CAMEL WHITE BOARD MARKER INK BLUE",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 36,
    "sourceNo": 36,
    "name": "CAMEL WHITE BOARD MARKER INK BLACK",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 37,
    "sourceNo": 37,
    "name": "CAMEL WHITE BOARD MARKER INK RED",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 38,
    "sourceNo": 38,
    "name": "FABER CASTEL HIGHLIGHTER - YELLOW",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 39,
    "sourceNo": 39,
    "name": "CAMEL ERAZEX PENS - WHITE FLUID",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 40,
    "sourceNo": 40,
    "name": "SD MINI CUTTER STEEL BLADES",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 41,
    "sourceNo": 41,
    "name": "SKETCH PENS BLUE",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 42,
    "sourceNo": 42,
    "name": "SKETCH PENS BLACK",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 43,
    "sourceNo": 43,
    "name": "SKETCH PENS RED",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 44,
    "sourceNo": 44,
    "name": "SKETCH PENS GREEN",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 45,
    "sourceNo": 45,
    "name": "SKETCH PENS PINK",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 46,
    "sourceNo": 46,
    "name": "SKETCH PENS ALL CLOURS",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 47,
    "sourceNo": 47,
    "name": "KORES WHITE CHALKPIECES - DUST LESS (1 Box = 18 No's)",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 45
  },
  {
    "id": 48,
    "sourceNo": 48,
    "name": "KORES COLOUR CHALKPIECES - DUST LESS (1 Box = 18 No's)",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 45
  },
  {
    "id": 49,
    "sourceNo": 49,
    "name": "SONY CD",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 50,
    "sourceNo": 50,
    "name": "SONY DVD",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 51,
    "sourceNo": 51,
    "name": "CD MAILER (HANDLE WITH CARE)",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 8
  },
  {
    "id": 52,
    "sourceNo": 52,
    "name": "CD COVERS",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 53,
    "sourceNo": 53,
    "name": "CD POUCHS (BAG)",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 54,
    "sourceNo": 54,
    "name": "ASHOK SEALING WAX (1 BOXE = 10 NO'S)",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 120
  },
  {
    "id": 55,
    "sourceNo": 55,
    "name": "NAYAGARA BOX FILES BIG",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 56,
    "sourceNo": 56,
    "name": "NAYAGARA BOX FILES BIG STEEL CLIPS (GOOD GUALITY)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 57,
    "sourceNo": 57,
    "name": "NAYAGARA BOX FILES SMALL 1/4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 58,
    "sourceNo": 58,
    "name": "NAYAGARA URGENT & ORDINARY PADS (1 PACKET = 12 NO'S)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 59,
    "sourceNo": 59,
    "name": "NAYAGARA PVC FOLDERS (LEGAL)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 60,
    "sourceNo": 60,
    "name": "NAYAGARA PVC FOLDERS - A4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 61,
    "sourceNo": 61,
    "name": "NAYAGARA PVC FOLDERS - A3",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 62,
    "sourceNo": 62,
    "name": "SUN 150 FOLDERS - LEGAL",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 63,
    "sourceNo": 63,
    "name": "SUN 150 FOLDERS - LEGAL (WITH OUT FILING)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 64,
    "sourceNo": 64,
    "name": "SUN 150 FOLDERS - A4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 65,
    "sourceNo": 65,
    "name": "SUN 200 FOLDERS - A4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 66,
    "sourceNo": 66,
    "name": "TAPE DISPENCER - TAPE CUTTER",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 67,
    "sourceNo": 67,
    "name": "ENVELOPS COVERS BROWN 6 X 4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 68,
    "sourceNo": 68,
    "name": "ENVELOPS COVERS BROWN 10 X 4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 69,
    "sourceNo": 69,
    "name": "ENVELOPS COVERS BROWN 11 X 5",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 70,
    "sourceNo": 70,
    "name": "COVERS BROWN - A4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 71,
    "sourceNo": 71,
    "name": "ENVELOP COVERS WHITE 6 X 4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 72,
    "sourceNo": 72,
    "name": "ENVELOP COVERS WHITE 10 X 4",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 73,
    "sourceNo": 73,
    "name": "ENVELOP COVERS WHITE 11 X 5",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 74,
    "sourceNo": 74,
    "name": "ENVELOP COVERS BROWN 11 X 5",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 5
  },
  {
    "id": 75,
    "sourceNo": 75,
    "name": "CLOTH COVERS 11 X 5",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 76,
    "sourceNo": 76,
    "name": "CLOTH COVERS 12 X 10 (1 PACKET = 100 NO'S)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 77,
    "sourceNo": 77,
    "name": "CLOTH COVERS 15 X 11 (1 PACKET = 100 NO'S)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 78,
    "sourceNo": 78,
    "name": "CLOTH COVERS 16 X 12 (1 PACKET = 100 NO'S)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 79,
    "sourceNo": 79,
    "name": "CLOTH COVERS A4 (1 PACKET = 100 NO'S)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 80,
    "sourceNo": 80,
    "name": "KANGARO STAPLER -MISSION NO :10 ICON (1 BOX = 10 NO'S)",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 180
  },
  {
    "id": 81,
    "sourceNo": 81,
    "name": "KANGARO STAPLER -MISSION 10-D (1 BOX = 10 NO'S)",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 300
  },
  {
    "id": 82,
    "sourceNo": 82,
    "name": "KANGARO STAPLER - MISSION HP - 45 (BIG )",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 850
  },
  {
    "id": 83,
    "sourceNo": 83,
    "name": "KANGARO STAPLES PIN NO : 10 - 1M ( 1 BOX = 20 Packets)",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 180
  },
  {
    "id": 84,
    "sourceNo": 84,
    "name": "KANGARO STAPLES PIN BIG 24/6",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 85,
    "sourceNo": 85,
    "name": "KANGARO PUNCHING MISSION SMALL 280- 8CM",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 86,
    "sourceNo": 86,
    "name": "KANGARO PUNCHING MISSION DP - 500",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 87,
    "sourceNo": 87,
    "name": "KANGARO PUNCHING MISSION DP - 700",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 88,
    "sourceNo": 88,
    "name": "KANGARO SINGLE PUNCH 2mm Punching Capacity",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 89,
    "sourceNo": 89,
    "name": "PAPER WEIGHT RUBBER GENERAL",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 90,
    "sourceNo": 90,
    "name": "NATRAJ SCALE LONG 30-CMS (GENARAL)",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 91,
    "sourceNo": 91,
    "name": "STEEL SCALES LONG",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 92,
    "sourceNo": 92,
    "name": "IRON CLIPS TIGER",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 93,
    "sourceNo": 93,
    "name": "KENT LAMINATION POUCH 75 X 105MM,250 MIC",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 150
  },
  {
    "id": 94,
    "sourceNo": 94,
    "name": "FEVI STICK 8 GRMS (1 BOX = 30 NO'S)",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 95,
    "sourceNo": 95,
    "name": "FEVI KWIK 1 GRM",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 96,
    "sourceNo": 96,
    "name": "CALCULATOR - CITIZEN - 512 GENERAL",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 350
  },
  {
    "id": 97,
    "sourceNo": 97,
    "name": "CALCULATOR - CITICAL CT - 512 GST",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 350
  },
  {
    "id": 98,
    "sourceNo": 98,
    "name": "CAMEL STAMP PAD MEDIUM - NO-2 ( 110 X 70MM) VIOLET ( 1 BOX = 10 NO'S)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 99,
    "sourceNo": 99,
    "name": "CAMEL STAMP PAD MEDIUM - (45) VIOLET",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 100,
    "sourceNo": 100,
    "name": "CAMEL STAMP PAD MEDIUM - NO-2 ( 110 X 70MM) GREEN ( 1 BOX = 10 NO'S)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 101,
    "sourceNo": 101,
    "name": "CAMEL STAMP PAD LARGE - (70) RED",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 102,
    "sourceNo": 102,
    "name": "CAMEL STAMP PAD LARGE - (70) VIOLET",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 103,
    "sourceNo": 103,
    "name": "CAMEL STAMP PAD LARGE UN (PLAIN ) - (70)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 104,
    "sourceNo": 104,
    "name": "A4 TRANSPARENCY FILM (OHP SHEETS)",
    "category": "Markers & Printing",
    "description": "2 BOXES",
    "price": 450
  },
  {
    "id": 105,
    "sourceNo": 105,
    "name": "A4 COLOUR (OHP SHEETS)",
    "category": "Markers & Printing",
    "description": "1 BOXE",
    "price": 500
  },
  {
    "id": 106,
    "sourceNo": 106,
    "name": "BRILL STAMP PAD INK 700 ML -VIOLET",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 107,
    "sourceNo": 107,
    "name": "BRILL STAMP PAD INK 350 ML - VIOLET",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 108,
    "sourceNo": 108,
    "name": "BRILL STAMP PAD INK 350 ML - RED",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 109,
    "sourceNo": 109,
    "name": "BRILL STAMP PAD INK 100 ML - GREEN",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 110,
    "sourceNo": 110,
    "name": "NAPTHINE BALLS 500 G PACKET",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 120
  },
  {
    "id": 111,
    "sourceNo": 111,
    "name": "PENCIL CELLS 9VOLTS",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 35
  },
  {
    "id": 112,
    "sourceNo": 112,
    "name": "DURACELL AA (GENERAL SIZE) (1Sheets = 10 No's)",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 220
  },
  {
    "id": 113,
    "sourceNo": 113,
    "name": "DURACELL AAA ( SMALL SIZE) (1Sheets = 10 No's)",
    "category": "Office Supplies",
    "description": "Estimated institutional price",
    "price": 220
  },
  {
    "id": 114,
    "sourceNo": 114,
    "name": "NIPPO PENCIL CELLS AA -General SIZE",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 35
  },
  {
    "id": 115,
    "sourceNo": 115,
    "name": "NIPPO PENCIL CELLS AAA- SMALL SIZE",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 35
  },
  {
    "id": 116,
    "sourceNo": 116,
    "name": "LOCK - 50MM (Rs.50/-)",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 117,
    "sourceNo": 117,
    "name": "SCISSORE SMALL WILSON - 11.55 MM (ORDINARY)",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 40
  },
  {
    "id": 118,
    "sourceNo": 118,
    "name": "SCISSORE MEDIUM EAGLE -666 - 16.5MM (ORDINARY)",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 70
  },
  {
    "id": 119,
    "sourceNo": 119,
    "name": "SCISSORE BIG EAGLE -777 - 17.5MM (ORDINARY)",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 120,
    "sourceNo": 120,
    "name": "DUSTER AGRA",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 121,
    "sourceNo": 121,
    "name": "WHITE BOARD DUSTER",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 122,
    "sourceNo": 122,
    "name": "PRIMIER CELLO TAP 1\"",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 123,
    "sourceNo": 123,
    "name": "CELLO TAPE BROWN 1. 1/2 \" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 124,
    "sourceNo": 124,
    "name": "CELLO TAPE BROWN 2\" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 125,
    "sourceNo": 125,
    "name": "CELLO TAPE BROWN 3\" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 110
  },
  {
    "id": 126,
    "sourceNo": 126,
    "name": "CELLO TAPE WHITE 1\" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 40
  },
  {
    "id": 127,
    "sourceNo": 127,
    "name": "CELLO TAPE WHITE 1. 1/2\" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 128,
    "sourceNo": 128,
    "name": "CELLO TAPE WHITE 2\" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 129,
    "sourceNo": 129,
    "name": "CELLO TAPE WHITE 3\" 60MTR TUBE",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 110
  },
  {
    "id": 130,
    "sourceNo": 130,
    "name": "PACKING THREAD (PLASTIC)",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 131,
    "sourceNo": 131,
    "name": "FOAM TAPE TWO SIDE 1''",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 70
  },
  {
    "id": 132,
    "sourceNo": 132,
    "name": "FOAM TAPE TWO SIDE 2''",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 120
  },
  {
    "id": 133,
    "sourceNo": 133,
    "name": "FILE LACE ( GREEN )",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 134,
    "sourceNo": 134,
    "name": "PAPER TAG 6\" SMALL",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 135,
    "sourceNo": 135,
    "name": "PAPER TAG 8\" MEDIUM",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 136,
    "sourceNo": 136,
    "name": "PAPER TAG 10\" LONG",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 137,
    "sourceNo": 137,
    "name": "GUM CAN 5 LITER CAN",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 700
  },
  {
    "id": 138,
    "sourceNo": 138,
    "name": "PLASTIC CLIPS PREMIER NO-2",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 139,
    "sourceNo": 139,
    "name": "PLASTIC CLIPS DOLY NO-2",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 140,
    "sourceNo": 140,
    "name": "BINDER CLIPS 19 MM",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 141,
    "sourceNo": 141,
    "name": "BINDER CLIPS 25 MM",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 142,
    "sourceNo": 142,
    "name": "BINDER CLIPS 32 MM",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 143,
    "sourceNo": 143,
    "name": "BINDER CLIPS 44 MM",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 144,
    "sourceNo": 144,
    "name": "SCRIBBLING PADS GUPTS' S - 888 WHITE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 145,
    "sourceNo": 145,
    "name": "SCRIBBLING PADS GUPTS' S - 777 WHITE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 146,
    "sourceNo": 146,
    "name": "SCRIBBLING PADS GUPTS' S - 666 WHITE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 147,
    "sourceNo": 147,
    "name": "SCRIBBLING PADS GUPTS' S - 555 WHITE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 148,
    "sourceNo": 148,
    "name": "SCRIBBLING PADS GUPTS' S - 888 RULE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 149,
    "sourceNo": 149,
    "name": "SCRIBBLING PADS GUPTS' S - 777 RULE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 150,
    "sourceNo": 150,
    "name": "SCRIBBLING PADS GUPTS' S - 666 RULE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 151,
    "sourceNo": 151,
    "name": "SCRIBBLING PADS GUPTS' S - 555 RULE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 152,
    "sourceNo": 152,
    "name": "SPIRAL GUPT'S - 888 RULE",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 153,
    "sourceNo": 153,
    "name": "SPIRAL GUPT'S - 777 RULE",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 154,
    "sourceNo": 154,
    "name": "SPIRAL GUPT'S - 666 RULE",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 155,
    "sourceNo": 155,
    "name": "SPIRAL GUPT'S - 555 RULE",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 156,
    "sourceNo": 156,
    "name": "MARK LABELS (ROUND STICKERS) CODE -P-112,WHITE ,SIZE-DIA4100",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 157,
    "sourceNo": 157,
    "name": "BELL CLIPS JEM CLIPS 26MM",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 30
  },
  {
    "id": 158,
    "sourceNo": 158,
    "name": "BELL PINS 70 GRAMS",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 159,
    "sourceNo": 159,
    "name": "STICK NOTE PAD 3 IN 1 (PLASTIC)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 160,
    "sourceNo": 160,
    "name": "STICK NOTE PAD 4 IN 1",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 161,
    "sourceNo": 161,
    "name": "STICK NOTE PAD 5 IN 1",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 162,
    "sourceNo": 162,
    "name": "GRAPH BOOKS GENERAL 100 PAGES",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 45
  },
  {
    "id": 163,
    "sourceNo": 163,
    "name": "SEMI GRAPH BOOKS 100 PAGES",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 45
  },
  {
    "id": 164,
    "sourceNo": 164,
    "name": "SCHOLAR DRAWING BOARD PINS ( 1 Boxe = 10 No's)",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 165,
    "sourceNo": 165,
    "name": "SPONZE PADS (WATER DAMPER)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 60
  },
  {
    "id": 166,
    "sourceNo": 166,
    "name": "LOOSE SPONG ( DAMPER )",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 167,
    "sourceNo": 167,
    "name": "LONG NOTE BOOK 220 PAGES WHITE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 168,
    "sourceNo": 168,
    "name": "LONG NOTE BOOK 220 PAGES RULE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 169,
    "sourceNo": 169,
    "name": "TORTOISE WHITE THREAD ROLLS (CONE ) ART NO 2320,G TKT 40S",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 100
  },
  {
    "id": 170,
    "sourceNo": 170,
    "name": "RUBEBER BANDAS 1/2 Kg Packets BIG",
    "category": "Other",
    "description": "Estimated institutional price",
    "price": 180
  },
  {
    "id": 171,
    "sourceNo": 171,
    "name": "RUBBER BANDAS 1/2 Kg Packets SMALL SIZE CASH",
    "category": "Adhesives & Packing",
    "description": "Estimated institutional price",
    "price": 180
  },
  {
    "id": 172,
    "sourceNo": 172,
    "name": "CARBON PAPERS - BLUE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 173,
    "sourceNo": 173,
    "name": "CARBON PAPERS - BLACK",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 174,
    "sourceNo": 174,
    "name": "STICK FILES - LEGAL",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 175,
    "sourceNo": 175,
    "name": "STICK FILES - A4 COLOUR",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 176,
    "sourceNo": 176,
    "name": "STICK FILES - A4 (TRANSPARENT)",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 25
  },
  {
    "id": 177,
    "sourceNo": 177,
    "name": "KNIFE (GOOD QUALITY)",
    "category": "Tools",
    "description": "Estimated institutional price",
    "price": 40
  },
  {
    "id": 178,
    "sourceNo": 178,
    "name": "ID CARD HOOKS",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 20
  },
  {
    "id": 179,
    "sourceNo": 179,
    "name": "GIFT COVER",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 15
  },
  {
    "id": 180,
    "sourceNo": 180,
    "name": "BOMBAY HANGING HOOKS PLASTIC",
    "category": "Office Tools",
    "description": "Estimated institutional price",
    "price": 50
  },
  {
    "id": 181,
    "sourceNo": 182,
    "name": "Canon 2000 (G20) Made in Japan, Ink Bottles :- 790C, 790BK,790M, 790Y,Pixma (NEC OFFICE)",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 650
  },
  {
    "id": 182,
    "sourceNo": 183,
    "name": "BOUND NOTE BOOKS NO-3 (PAGES 265)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 183,
    "sourceNo": 184,
    "name": "BOUND NOTE BOOKS NO-2 (PAGES 170)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 80
  },
  {
    "id": 184,
    "sourceNo": 185,
    "name": "TOTEM BALL PEN MEOW",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 185,
    "sourceNo": 186,
    "name": "PEN ERASER",
    "category": "Writing",
    "description": "Estimated institutional price",
    "price": 10
  },
  {
    "id": 186,
    "sourceNo": 187,
    "name": "Epson (L3216) - Ink Bottles 003Y, 003M, 003C, 003BK",
    "category": "Markers & Printing",
    "description": "Estimated institutional price",
    "price": 550
  },
  {
    "id": 187,
    "sourceNo": 188,
    "name": "Daily sheet Rule 34 lines",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 35
  },
  {
    "id": 188,
    "sourceNo": 189,
    "name": "COAD :19-21, SIZE 48CM \\*56 CM GARBAGE BAGS (MEDIUM) DUST BI COVERS",
    "category": "Files & Covers",
    "description": "Estimated institutional price",
    "price": 250
  },
  {
    "id": 189,
    "sourceNo": 1,
    "name": "A4 WHITE PAPER HAMMERMILL 75 GSM (COPIER)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 380
  },
  {
    "id": 190,
    "sourceNo": 2,
    "name": "LEEGAL-FS WHITE PAPER HAMMERMILL 75 GSM (COPIER)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 380
  },
  {
    "id": 191,
    "sourceNo": 3,
    "name": "A-3 WHITE PAPER HAMMERMILL 75 GSM (COPIER)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 192,
    "sourceNo": 4,
    "name": "A4 - COLOR SPRINT COPIER PAPER - 75 GSM YELLOW",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 193,
    "sourceNo": 5,
    "name": "A4 - COLOR SPRINT COPIER PAPER - 75 GSM PINK",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 194,
    "sourceNo": 6,
    "name": "A4 - COLOR SPRINT COPIER PAPER - 75 GSM GOLD SPOT",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 195,
    "sourceNo": 7,
    "name": "A4 - COLOR SPRINT COPIER PAPER - 75 GSM LITE BLUE",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 196,
    "sourceNo": 8,
    "name": "A4 - COLOR SPRINT COPIER PAPER - 75 GSM LIGHT GREEN (MINT)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 450
  },
  {
    "id": 197,
    "sourceNo": 9,
    "name": "8.6 WHITE PAPER 1/4 TYPE (32 PACKETS 1BAG)",
    "category": "Paper",
    "description": "Estimated institutional price",
    "price": 500
  }
];

const ICONS = {
  Writing: "✏️",
  Paper: "📄",
  "Files & Covers": "📁",
  "Office Tools": "📎",
  "Adhesives & Packing": "📦",
  "Markers & Printing": "🖊️",
  "Office Supplies": "🗂️",
  Tools: "🛠️",
  Other: "📌",
};

function Stationery() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showOther, setShowOther] = useState(false);
  const [otherItem, setOtherItem] = useState({
    name: "",
    quantity: 1,
    price: "",
  });

  const categories = useMemo(
    () => ["All", ...new Set(STATIONERY_ITEMS.map((item) => item.category))],
    []
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return STATIONERY_ITEMS.filter((item) => {
      const categoryMatch =
        activeCategory === "All" || item.category === activeCategory;
      const searchMatch =
        !query || item.name.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addOtherItem = () => {
    const name = otherItem.name.trim();
    const quantity = Number(otherItem.quantity);
    const price = Number(otherItem.price);

    if (!name || quantity < 1 || !Number.isFinite(price) || price <= 0) {
      alert("Please enter item name, quantity and price.");
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        id: `other-${Date.now()}`,
        sourceNo: "OTHER",
        name,
        category: "Other",
        description: "Custom stationery item",
        price,
        quantity,
        custom: true,
      },
    ]);

    setOtherItem({ name: "", quantity: 1, price: "" });
    setShowOther(false);
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const submitOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        itemId: item.custom ? null : item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentStatus: "NOT_REQUIRED",
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/stationery/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit stationery request.");
      }

      alert("Stationery request submitted successfully.");
      setCart([]);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to submit stationery request.");
    }
  };

  return (
    <div className="stationery-page">
      <header className="stationery-header">
        <div>
          <p className="page-label">FACULTY SERVICES</p>
          <h1>Stationery</h1>
          <p className="page-description">
            Select stationery items required for official college work.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="cart-button">
            🛒 <span>Order</span>
            {totalItems > 0 && <b>{totalItems}</b>}
          </div>
        </div>
      </header>

      <div className="stationery-search">
        <input
          type="text"
          placeholder="Search stationery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setShowOther((prev) => !prev)}>
          + Other Item
        </button>
      </div>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {showOther && (
        <div className="other-item-panel">
          <input
            type="text"
            placeholder="Enter item name"
            value={otherItem.name}
            onChange={(e) =>
              setOtherItem({ ...otherItem, name: e.target.value })
            }
          />

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={otherItem.quantity}
            onChange={(e) =>
              setOtherItem({ ...otherItem, quantity: e.target.value })
            }
          />

          <input
            type="number"
            min="1"
            placeholder="Price"
            value={otherItem.price}
            onChange={(e) =>
              setOtherItem({ ...otherItem, price: e.target.value })
            }
          />

          <button onClick={addOtherItem}>Add to Order</button>
        </div>
      )}

      <main className="stationery-grid">
        {filteredItems.map((item) => {
          const cartItem = cart.find(
            (cartProduct) => cartProduct.id === item.id
          );

          return (
            <div className="stationery-card" key={item.id}>
              <div className="stationery-card-top">
                <div className="stationery-icon">
                  {ICONS[item.category] || "📌"}
                </div>

                <span className="stationery-category">
                  {item.category}
                </span>
              </div>

              <div className="stationery-card-content">
                <h2>{item.name}</h2>
                <p>{item.description}</p>

                <div className="stationery-card-bottom">
                  <div className="stationery-price">
                    ₹{item.price}
                    <small> / item</small>
                  </div>

                  {cartItem ? (
                    <div className="quantity-control">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        −
                      </button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-button"
                      onClick={() => addToCart(item)}
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {cart.length > 0 && (
        <div className="order-summary-bar">
          <div>
            <strong>{totalItems} items</strong>
            <span>
              ₹{totalPrice.toFixed(2)} · Payment: Not Required
            </span>
          </div>

          <button onClick={submitOrder}>Continue →</button>
        </div>
      )}
    </div>
  );
}

export default Stationery;
