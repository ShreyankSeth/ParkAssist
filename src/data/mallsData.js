/**
 * @file mallsData.js
 * @description Dataset containing details for mall parking locations (Elante Mall Chandigarh & CP67 Mohali).
 * Features structured BookMyShow-style cinema seating rows (Alphabetical rows A, B, C, D with Left/Right Bays),
 * and a dedicated Electric Vehicle (EV) floor with fewer slots, built-in EV chargers, and higher rates.
 */

// Helper to generate BookMyShow-style rows and bays for parking floors
const generateFloorRows = (floorCode, floorName, rowConfigs, occupiedIds = [], isEvFloor = false, baseRate30 = 30, hourly = 50) => {
  const rows = [];
  let totalSlotsCount = 0;

  rowConfigs.forEach(({ letter, leftCount, rightCount }) => {
    const leftBay = [];
    const rightBay = [];

    // Left Bay
    for (let i = 1; i <= leftCount; i++) {
      totalSlotsCount++;
      const slotNumStr = i.toString().padStart(2, '0');
      const slotId = `${floorCode}-${letter}-${slotNumStr}`;
      const isOccupied = occupiedIds.includes(slotId);

      leftBay.push({
        id: slotId,
        floor: floorCode,
        floorName: floorName,
        row: letter,
        number: i,
        displayNumber: slotNumStr,
        bay: 'left',
        hasEvCharger: isEvFloor || (i % 6 === 0),
        status: isOccupied ? 'booked' : 'available',
        baseRate30Min: baseRate30,
        hourlyRate: hourly
      });
    }

    // Right Bay
    for (let j = leftCount + 1; j <= leftCount + rightCount; j++) {
      totalSlotsCount++;
      const slotNumStr = j.toString().padStart(2, '0');
      const slotId = `${floorCode}-${letter}-${slotNumStr}`;
      const isOccupied = occupiedIds.includes(slotId);

      rightBay.push({
        id: slotId,
        floor: floorCode,
        floorName: floorName,
        row: letter,
        number: j,
        displayNumber: slotNumStr,
        bay: 'right',
        hasEvCharger: isEvFloor || (j % 5 === 0),
        status: isOccupied ? 'booked' : 'available',
        baseRate30Min: baseRate30,
        hourlyRate: hourly
      });
    }

    rows.push({
      letter,
      leftBay,
      rightBay
    });
  });

  // Flat slots array for rapid searching and metrics calculation
  const allSlots = rows.flatMap(r => [...r.leftBay, ...r.rightBay]);

  return {
    name: floorName,
    code: floorCode,
    isEvFloor: isEvFloor,
    baseRate30Min: baseRate30,
    hourlyRate: hourly,
    totalSlots: totalSlotsCount,
    rows: rows,
    slots: allSlots
  };
};

export const INITIAL_MALLS = [
  {
    id: 'elante-chandigarh',
    name: 'Elante Mall, Chandigarh',
    shortName: 'Elante Mall',
    city: 'Chandigarh',
    area: 'Industrial Area Phase I',
    pincode: '160002',
    latitude: 30.7056,
    longitude: 76.8013,
    operatingHours: '10:00 AM - 10:00 PM',
    image: '/assets/parking.jpg',
    floors: [
      // 1. DEDICATED EV CHARGING FLOOR (Fewer slots, all slots with EV charger, higher pricing)
      generateFloorRows(
        'EV',
        '⚡ EV Dedicated Floor (Fast-Charger Zone)',
        [
          { letter: 'B', leftCount: 5, rightCount: 6 },
          { letter: 'A', leftCount: 5, rightCount: 6 }
        ],
        ['EV-B-02', 'EV-B-05', 'EV-A-03', 'EV-A-09'],
        true, // isEvFloor
        80,   // ₹80 base rate for first 30 mins
        100   // ₹100 per hour
      ),

      // 2. BASEMENT 1 (B1)
      generateFloorRows(
        'B1',
        'Basement 1 (B1)',
        [
          { letter: 'D', leftCount: 8, rightCount: 8 },
          { letter: 'C', leftCount: 8, rightCount: 8 },
          { letter: 'B', leftCount: 8, rightCount: 8 },
          { letter: 'A', leftCount: 8, rightCount: 8 }
        ],
        ['B1-D-02', 'B1-D-06', 'B1-D-11', 'B1-C-03', 'B1-C-09', 'B1-C-14', 'B1-B-01', 'B1-B-05', 'B1-B-12', 'B1-A-04', 'B1-A-08', 'B1-A-15'],
        false,
        30,
        50
      ),

      // 3. BASEMENT 2 (B2)
      generateFloorRows(
        'B2',
        'Basement 2 (B2)',
        [
          { letter: 'D', leftCount: 8, rightCount: 8 },
          { letter: 'C', leftCount: 8, rightCount: 8 },
          { letter: 'B', leftCount: 8, rightCount: 8 },
          { letter: 'A', leftCount: 8, rightCount: 8 }
        ],
        ['B2-D-01', 'B2-D-07', 'B2-D-13', 'B2-C-04', 'B2-C-10', 'B2-B-03', 'B2-B-08', 'B2-B-14', 'B2-A-02', 'B2-A-09', 'B2-A-12'],
        false,
        30,
        50
      ),

      // 4. GROUND FLOOR (GF)
      generateFloorRows(
        'GF',
        'Ground Floor (GF)',
        [
          { letter: 'C', leftCount: 8, rightCount: 8 },
          { letter: 'B', leftCount: 8, rightCount: 8 },
          { letter: 'A', leftCount: 8, rightCount: 8 }
        ],
        ['GF-C-02', 'GF-C-07', 'GF-C-12', 'GF-B-04', 'GF-B-09', 'GF-B-15', 'GF-A-03', 'GF-A-08', 'GF-A-14'],
        false,
        30,
        50
      )
    ]
  },
  {
    id: 'cp67-mohali',
    name: 'CP67 Mall, Mohali',
    shortName: 'CP67 Mall',
    city: 'Mohali',
    area: 'Sector 67, IT City Road',
    pincode: '160062',
    latitude: 30.6762,
    longitude: 76.7408,
    operatingHours: '10:00 AM - 11:00 PM',
    image: '/assets/parking.jpg',
    floors: [
      // 1. DEDICATED EV CHARGING FLOOR
      generateFloorRows(
        'EV',
        '⚡ EV Dedicated Floor (Fast-Charger Zone)',
        [
          { letter: 'B', leftCount: 4, rightCount: 5 },
          { letter: 'A', leftCount: 4, rightCount: 5 }
        ],
        ['EV-B-02', 'EV-A-04', 'EV-A-08'],
        true,
        80,   // ₹80 base rate for first 30 mins
        100   // ₹100 per hour
      ),

      // 2. BASEMENT 1 (B1)
      generateFloorRows(
        'B1',
        'Basement 1 (B1)',
        [
          { letter: 'C', leftCount: 7, rightCount: 7 },
          { letter: 'B', leftCount: 7, rightCount: 7 },
          { letter: 'A', leftCount: 7, rightCount: 7 }
        ],
        ['B1-C-02', 'B1-C-06', 'B1-C-10', 'B1-B-03', 'B1-B-08', 'B1-B-13', 'B1-A-01', 'B1-A-05', 'B1-A-11'],
        false,
        25,
        40
      ),

      // 3. BASEMENT 2 (B2)
      generateFloorRows(
        'B2',
        'Basement 2 (B2)',
        [
          { letter: 'C', leftCount: 7, rightCount: 7 },
          { letter: 'B', leftCount: 7, rightCount: 7 },
          { letter: 'A', leftCount: 7, rightCount: 7 }
        ],
        ['B2-C-01', 'B2-C-05', 'B2-C-11', 'B2-B-04', 'B2-B-09', 'B2-A-03', 'B2-A-07', 'B2-A-12'],
        false,
        25,
        40
      ),

      // 4. GROUND FLOOR (GF)
      generateFloorRows(
        'GF',
        'Ground Floor (GF)',
        [
          { letter: 'B', leftCount: 7, rightCount: 7 },
          { letter: 'A', leftCount: 7, rightCount: 7 }
        ],
        ['GF-B-02', 'GF-B-06', 'GF-B-10', 'GF-A-01', 'GF-A-05', 'GF-A-09'],
        false,
        25,
        40
      )
    ]
  }
];

// Helper to compute total slots across all floors of a mall
INITIAL_MALLS.forEach(mall => {
  mall.totalSlots = mall.floors.reduce((acc, f) => acc + f.totalSlots, 0);
  mall.baseRate30Min = mall.floors[1]?.baseRate30Min || 30;
  mall.hourlyRate = mall.floors[1]?.hourlyRate || 50;
});
