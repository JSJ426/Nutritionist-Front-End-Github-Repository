// 알레르기 정보 매핑
export const allergyNames: { [key: number]: string } = {
  1: "난류",
  2: "우유",
  3: "메밀",
  4: "땅콩",
  5: "대두",
  6: "밀",
  7: "고등어",
  8: "게",
  9: "새우",
  10: "돼지고기",
  11: "복숭아",
  12: "토마토",
  13: "아황산류",
  14: "호두",
  15: "닭고기",
  16: "쇠고기",
  17: "오징어",
  18: "조개류"
};

// 2026년 1월 날짜 매핑 (평일만)
const jan2026Dates: { [key: string]: { week: number; day: string; date: number } } = {
  "2026-01-01": { week: 0, day: "수", date: 1 },
  "2026-01-02": { week: 0, day: "목", date: 2 },
  "2026-01-03": { week: 0, day: "금", date: 3 },
  "2026-01-06": { week: 1, day: "월", date: 6 },
  "2026-01-07": { week: 1, day: "화", date: 7 },
  "2026-01-08": { week: 1, day: "수", date: 8 },
  "2026-01-09": { week: 1, day: "목", date: 9 },
  "2026-01-12": { week: 1, day: "금", date: 12 },
  "2026-01-13": { week: 2, day: "월", date: 13 },
  "2026-01-14": { week: 2, day: "화", date: 14 },
  "2026-01-15": { week: 2, day: "수", date: 15 },
  "2026-01-16": { week: 2, day: "목", date: 16 },
  "2026-01-19": { week: 2, day: "금", date: 19 },
  "2026-01-20": { week: 3, day: "월", date: 20 },
  "2026-01-21": { week: 3, day: "화", date: 21 },
  "2026-01-22": { week: 3, day: "수", date: 22 },
  "2026-01-23": { week: 3, day: "목", date: 23 },
  "2026-01-26": { week: 3, day: "금", date: 26 },
  "2026-01-27": { week: 4, day: "월", date: 27 },
  "2026-01-28": { week: 4, day: "화", date: 28 },
  "2026-01-29": { week: 4, day: "수", date: 29 },
  "2026-01-30": { week: 4, day: "목", date: 30 }
};

// 2025년 12월 날짜 매핑 (평일만)
const dec2025Dates: { [key: string]: { week: number; day: string; date: number } } = {
  "2025-12-01": { week: 0, day: "월", date: 1 },
  "2025-12-02": { week: 0, day: "화", date: 2 },
  "2025-12-03": { week: 0, day: "수", date: 3 },
  "2025-12-04": { week: 0, day: "목", date: 4 },
  "2025-12-05": { week: 0, day: "금", date: 5 },
  "2025-12-08": { week: 1, day: "월", date: 8 },
  "2025-12-09": { week: 1, day: "화", date: 9 },
  "2025-12-10": { week: 1, day: "수", date: 10 },
  "2025-12-11": { week: 1, day: "목", date: 11 },
  "2025-12-12": { week: 1, day: "금", date: 12 },
  "2025-12-15": { week: 2, day: "월", date: 15 },
  "2025-12-16": { week: 2, day: "화", date: 16 },
  "2025-12-17": { week: 2, day: "수", date: 17 },
  "2025-12-18": { week: 2, day: "목", date: 18 },
  "2025-12-19": { week: 2, day: "금", date: 19 },
  "2025-12-22": { week: 3, day: "월", date: 22 },
  "2025-12-23": { week: 3, day: "화", date: 23 },
  "2025-12-24": { week: 3, day: "수", date: 24 },
  "2025-12-25": { week: 3, day: "목", date: 25 },
  "2025-12-26": { week: 3, day: "금", date: 26 },
  "2025-12-29": { week: 4, day: "월", date: 29 },
  "2025-12-30": { week: 4, day: "화", date: 30 },
  "2025-12-31": { week: 4, day: "수", date: 31 }
};

// 월간 식단 데이터 (MealMonthlyPage에서 가져온 구조)
const mealDataByMonth: { [key: string]: any } = {
  "2026-01": {
    "month": "2026-01",
    "target": "고등학교",
    "weeks": [
      {
        "week": "1주차",
        "meals": {
          "수": {
            "lunch": {
              "menu": "흰쌀밥, 육개장, 불고기, 콩나물무침, 배추김치",
              "allergy": [1, 5, 6, 13]
            },
            "dinner": {
              "menu": "현미밥, 김치찌개, 돈까스, 깍두기, 우유",
              "allergy": [1, 2, 5, 10, 13]
            }
          },
          "목": {
            "lunch": {
              "menu": "현미밥, 된장찌개, 고등어구이, 시금치나물, 깍두기",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 순두부찌개, 제육볶음, 상추쌈, 배추김치",
              "allergy": [5, 10, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "잡곡밥, 미역국, 제육볶음, 계란말이, 배추김치",
              "allergy": [1, 5, 10, 13]
            },
            "dinner": {
              "menu": "카레라이스, 치킨너겟, 단무지, 과일",
              "allergy": [1, 2, 5, 6, 15]
            }
          }
        }
      },
      {
        "week": "2주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "흰쌀밥, 순두부찌개, 닭갈비, 무생채, 깍두기",
              "allergy": [5, 6, 13, 15]
            },
            "dinner": {
              "menu": "잡곡밥, 콩나물국, 고등어구이, 배추김치, 요구르트",
              "allergy": [2, 5, 9, 13]
            }
          },
          "화": {
            "lunch": {
              "menu": "카레라이스, 단무지, 치킨너겟, 요구르트",
              "allergy": [1, 2, 5, 12, 15]
            },
            "dinner": {
              "menu": "흰쌀밥, 미역국, 불고기, 김치, 과일",
              "allergy": [5, 6, 13, 16]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 김치찌개, 돈까스, 샐러드, 배추김치",
              "allergy": [1, 5, 10, 12, 13]
            },
            "dinner": {
              "menu": "잡곡밥, 된장찌개, 생선구이, 시금치나물, 깍두기",
              "allergy": [5, 6, 9, 13]
            }
          },
          "목": {
            "lunch": {
              "menu": "흰쌀밥, 콩나물국, 삼치구이, 감자조림, 깍두기",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "비빔밥, 계란국, 만두, 배추김치",
              "allergy": [1, 5, 6, 10, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "비빔밥, 계란국, 잡채, 김가루, 배추김치",
              "allergy": [1, 5, 6, 13]
            },
            "dinner": {
              "menu": "현미밥, 육개장, 닭강정, 깍두기",
              "allergy": [1, 5, 13, 15, 16]
            }
          }
        }
      },
      {
        "week": "3주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "잡곡밥, 미역국, 제육볶음, 두부조림, 배추김치",
              "allergy": [5, 6, 10, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 김치찌개, 함박스테이크, 샐러드, 깍두기",
              "allergy": [1, 2, 5, 10, 12]
            }
          },
          "화": {
            "lunch": {
              "menu": "흰쌀밥, 된장국, 갈치구이, 숙주나물, 깍두기",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "현미밥, 순두부찌개, 돈까스, 배추김치",
              "allergy": [1, 5, 10, 12, 13]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 떡국, 불고기, 명란젓, 배추김치",
              "allergy": [1, 5, 6, 9, 13]
            },
            "dinner": {
              "menu": "카레라이스, 치킨가스, 단무지, 우유",
              "allergy": [1, 2, 5, 12, 15]
            }
          },
          "목": {
            "lunch": {
              "menu": "김치볶음밥, 우동국물, 탕수육, 단무지",
              "allergy": [1, 5, 10, 12, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 미역국, 고등어조림, 깍두기",
              "allergy": [5, 6, 9, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "흰쌀밥, 육개장, 간장치킨, 오이무침, 깍두기",
              "allergy": [1, 5, 6, 13, 15]
            },
            "dinner": {
              "menu": "잡곡밥, 콩나물국, 제육볶음, 배추김치",
              "allergy": [5, 6, 10, 13]
            }
          }
        }
      },
      {
        "week": "4주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "현미밥, 순두부찌개, 고등어조림, 시금치무침, 배추김치",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 김치찌개, 닭볶음탕, 깍두기",
              "allergy": [5, 6, 13, 15]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 김치찌개, 돈까스, 양배추샐러드, 깍두기",
              "allergy": [1, 5, 10, 12, 13]
            },
            "dinner": {
              "menu": "비빔밥, 된장국, 만두, 배추김치",
              "allergy": [1, 5, 6, 10, 13]
            }
          },
          "수": {
            "lunch": {
              "menu": "흰쌀밥, 만두국, 닭볶음탕, 콩나물무침, 배추김치",
              "allergy": [1, 5, 10, 13, 15]
            },
            "dinner": {
              "menu": "현미밥, 미역국, 불고기, 상추쌈, 깍두기",
              "allergy": [5, 6, 13, 16]
            }
          },
          "목": {
            "lunch": {
              "menu": "카레라이스, 단무지, 함박스테이크, 과일",
              "allergy": [1, 2, 5, 10, 12]
            },
            "dinner": {
              "menu": "잡곡밥, 육개장, 고등어구이, 배추김치",
              "allergy": [5, 6, 9, 13, 16]
            }
          },
          "금": {
            "lunch": {
              "menu": "현미밥, 된장찌개, 삼겹살구이, 상추쌈, 깍두기",
              "allergy": [5, 6, 10, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 순두부찌개, 제육볶음, 배추김치, 요구르트",
              "allergy": [2, 5, 6, 10, 13]
            }
          }
        }
      },
      {
        "week": "5주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "흰쌀밥, 콩나물국, 고추장불고기, 계란말이, 배추김치",
              "allergy": [1, 5, 6, 13]
            },
            "dinner": {
              "menu": "현미밥, 김치찌개, 돈까스, 샐러드, 깍두기",
              "allergy": [1, 5, 10, 12, 13]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 미역국, 닭강정, 무생채, 깍두기",
              "allergy": [1, 5, 6, 13, 15]
            },
            "dinner": {
              "menu": "카레라이스, 치킨너겟, 단무지, 우유",
              "allergy": [1, 2, 5, 12, 15]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 육개장, 가자미구이, 김치전, 배추김치",
              "allergy": [1, 5, 6, 9, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 된장찌개, 제육볶음, 깍두기",
              "allergy": [5, 6, 10, 13]
            }
          },
          "목": {
            "lunch": {
              "menu": "볶음밥, 짬뽕국, 군만두, 단무지",
              "allergy": [1, 5, 9, 10, 13]
            },
            "dinner": {
              "menu": "잡곡밥, 미역국, 고등어구이, 배추김치",
              "allergy": [5, 6, 9, 13]
            }
          }
        }
      }
    ]
  },
  "2025-12": {
    "month": "2025-12",
    "target": "고등학교",
    "weeks": [
      {
        "week": "1주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "현미밥, 김치찌개, 갈비찜, 오이무침, 배추김치",
              "allergy": [5, 6, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 된장국, 생선구이, 깍두기",
              "allergy": [5, 6, 9, 13]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 순두부찌개, 닭강정, 상추쌈, 배추김치",
              "allergy": [1, 5, 6, 13, 15]
            },
            "dinner": {
              "menu": "현미밥, 미역국, 제육볶음, 무생채, 깍두기",
              "allergy": [5, 6, 10, 13]
            }
          },
          "수": {
            "lunch": {
              "menu": "흰쌀밥, 육개장, 불고기, 콩나물무침, 깍두기",
              "allergy": [5, 6, 13, 16]
            },
            "dinner": {
              "menu": "카레라이스, 치킨까스, 단무지, 과일",
              "allergy": [1, 2, 5, 12, 15]
            }
          },
          "목": {
            "lunch": {
              "menu": "현미밥, 콩나물국, 고등어조림, 시금치나물, 배추김치",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 김치찌개, 돈까스, 샐러드, 깍두기",
              "allergy": [1, 5, 10, 12, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "잡곡밥, 된장찌개, 삼치구이, 계란찜, 배추김치",
              "allergy": [1, 5, 6, 9, 13]
            },
            "dinner": {
              "menu": "볶음밥, 짜장, 군만두, 단무지",
              "allergy": [1, 5, 10, 13]
            }
          }
        }
      },
      {
        "week": "2주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "흰쌀밥, 미역국, 닭갈비, 무생채, 배추김치",
              "allergy": [5, 13, 15]
            },
            "dinner": {
              "menu": "현미밥, 순두부찌개, 고등어구이, 깍두기, 우유",
              "allergy": [2, 5, 9, 13]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 김치찌개, 함박스테이크, 상추쌈, 깍두기",
              "allergy": [1, 2, 5, 10, 12]
            },
            "dinner": {
              "menu": "흰쌀밥, 된장국, 오징어볶음, 배추김치",
              "allergy": [5, 6, 9, 13, 17]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 육개장, 제육볶음, 콩나물무침, 배추김치",
              "allergy": [5, 6, 10, 13]
            },
            "dinner": {
              "menu": "카레라이스, 치킨너겟, 단무지, 요구르트",
              "allergy": [1, 2, 5, 12, 15]
            }
          },
          "목": {
            "lunch": {
              "menu": "흰쌀밥, 콩나물국, 갈치구이, 감자조림, 깍두기",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "비빔밥, 계란국, 만두, 배추김치",
              "allergy": [1, 5, 6, 10, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "잡곡밥, 미역국, 간장치킨, 오이무침, 배추김치",
              "allergy": [1, 5, 6, 13, 15]
            },
            "dinner": {
              "menu": "현미밥, 김치찌개, 불고기, 상추쌈, 깍두기",
              "allergy": [5, 6, 13, 16]
            }
          }
        }
      },
      {
        "week": "3주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "흰쌀밥, 순두부찌개, 삼겹살구이, 상추쌈, 배추김치",
              "allergy": [5, 6, 10, 13]
            },
            "dinner": {
              "menu": "현미밥, 된장국, 고등어조림, 시금치나물, 깍두기",
              "allergy": [5, 6, 9, 13]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 김치찌개, 돈까스, 양배추샐러드, 배추김치",
              "allergy": [1, 5, 10, 12, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 미역국, 닭볶음탕, 깍두기",
              "allergy": [5, 13, 15]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 육개장, 가자미구이, 무생채, 배추김치",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "카레라이스, 함박스테이크, 단무지, 우유",
              "allergy": [1, 2, 5, 10, 12]
            }
          },
          "목": {
            "lunch": {
              "menu": "흰쌀밥, 콩나물국, 제육볶음, 계란말이, 깍두기",
              "allergy": [1, 5, 6, 10, 13]
            },
            "dinner": {
              "menu": "김치볶음밥, 우동국물, 탕수육, 배추김치",
              "allergy": [1, 5, 10, 12, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "잡곡밥, 된장찌개, 삼치구이, 콩나물무침, 배추김치",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "현미밥, 순두부찌개, 불고기, 상추쌈, 깍두기",
              "allergy": [5, 6, 13, 16]
            }
          }
        }
      },
      {
        "week": "4주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "흰쌀밥, 미역국, 닭강정, 무생채, 배추김치",
              "allergy": [1, 5, 6, 13, 15]
            },
            "dinner": {
              "menu": "현미밥, 김치찌개, 고등어구이, 깍두기, 요구르트",
              "allergy": [2, 5, 9, 13]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 육개장, 돈까스, 샐러드, 배추김치",
              "allergy": [1, 5, 10, 12, 13]
            },
            "dinner": {
              "menu": "흰쌀밥, 된장국, 오징어볶음, 두부무침, 깍두기",
              "allergy": [5, 6, 9, 13, 17]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 콩나물국, 제육볶음, 계란찜, 배추김치",
              "allergy": [1, 5, 10, 13]
            },
            "dinner": {
              "menu": "카레라이스, 치킨가스, 단무지, 과일",
              "allergy": [1, 2, 5, 12, 15]
            }
          },
          "목": {
            "lunch": {
              "menu": "흰쌀밥, 순두부찌개, 갈치구이, 시금치나물, 깍두기",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "비빔밥, 계란국, 만두, 배추김치",
              "allergy": [1, 5, 6, 10, 13]
            }
          },
          "금": {
            "lunch": {
              "menu": "잡곡밥, 김치찌개, 삼겹살구이, 상추쌈, 배추김치",
              "allergy": [5, 6, 10, 13]
            },
            "dinner": {
              "menu": "현미밥, 미역국, 불고기, 무생채, 깍두기",
              "allergy": [5, 6, 13, 16]
            }
          }
        }
      },
      {
        "week": "5주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": "흰쌀밥, 된장찌개, 고등어조림, 콩나물무침, 배추김치",
              "allergy": [5, 6, 9, 13]
            },
            "dinner": {
              "menu": "현미밥, 육개장, 닭볶음탕, 깍두기",
              "allergy": [5, 13, 15]
            }
          },
          "화": {
            "lunch": {
              "menu": "잡곡밥, 순두부찌개, 함박스테이크, 샐러드, 배추김치",
              "allergy": [1, 2, 5, 10, 12]
            },
            "dinner": {
              "menu": "흰쌀밥, 미역국, 제육볶음, 상추쌈, 깍두기",
              "allergy": [5, 6, 10, 13]
            }
          },
          "수": {
            "lunch": {
              "menu": "현미밥, 김치찌개, 돈까스, 오이무침, 배추김치",
              "allergy": [1, 5, 10, 12, 13]
            },
            "dinner": {
              "menu": "카레라이스, 치킨너겟, 단무지, 우유",
              "allergy": [1, 2, 5, 12, 15]
            }
          }
        }
      }
    ]
  }
};

export interface MealDetail {
  id: string;
  date: string;
  dayOfWeek: string;
  mealType: "중식" | "석식";
  menu: {
    rice: string;
    soup: string;
    main: string;
    sides: string[];
    dessert?: string;
  };
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sodium: number;
  };
  allergy: number[];
  operation: {
    participationRate: number;
    leftoverAmount: number;
    satisfaction: number;
  };
  history: {
    createdBy: string;
    createdAt: string;
    lastModifiedAt: string;
    modificationReason: string;
  };
}

// 메뉴 문자열을 파싱하여 카테고리별로 분류
function parseMenu(menuStr: string): { rice: string; soup: string; main: string; sides: string[]; dessert?: string } {
  const items = menuStr.split(', ');
  
  // 밥 찾기
  const rice = items.find(item => item.includes('밥')) || items[0];
  
  // 국/찌개 찾기
  const soup = items.find(item => 
    item.includes('국') || item.includes('찌개') || item.includes('탕')
  ) || '';
  
  // 주메뉴 찾기 (고기, 생선 등)
  const mainKeywords = ['불고기', '제육', '돈까스', '닭', '치킨', '갈비', '삼겹살', '함박', '오징어', '탕수육'];
  const main = items.find(item => 
    mainKeywords.some(keyword => item.includes(keyword))
  ) || items[2] || '';
  
  // 후식 찾기
  const dessertKeywords = ['과일', '우유', '요구르트'];
  const dessert = items.find(item => 
    dessertKeywords.some(keyword => item.includes(keyword))
  );
  
  // 나머지는 부메뉴
  const sides = items.filter(item => 
    item !== rice && item !== soup && item !== main && item !== dessert
  );
  
  return { rice, soup, main, sides, dessert };
}

// 메뉴와 칼로리 기반 영양소 계산 (추정치)
function calculateNutrition(menuStr: string, mealType: string): { calories: number; carbs: number; protein: number; fat: number; sodium: number } {
  const items = menuStr.split(', ');
  let baseCalories = mealType === "중식" ? 750 : 700;
  
  // 메뉴에 따라 칼로리 조정
  if (menuStr.includes('카레') || menuStr.includes('돈까스')) baseCalories += 100;
  if (menuStr.includes('탕수육') || menuStr.includes('튀김')) baseCalories += 80;
  if (menuStr.includes('불고기') || menuStr.includes('삼겹살')) baseCalories += 50;
  
  const calories = baseCalories + Math.floor(Math.random() * 100) - 50;
  const carbs = Math.floor(calories * 0.55 / 4); // 탄수화물 55%
  const protein = Math.floor(calories * 0.20 / 4); // 단백질 20%
  const fat = Math.floor(calories * 0.25 / 9); // 지방 25%
  const sodium = Math.floor(1200 + Math.random() * 600); // 1200-1800mg
  
  return { calories, carbs, protein, fat, sodium };
}

// 실제 날짜에서 요일 계산
function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

// 모든 식단 데이터 생성
export function generateAllMeals(): MealDetail[] {
  const allMeals: MealDetail[] = [];
  let idCounter = 1;
  
  // 2026년 1월 처리
  Object.entries(jan2026Dates).forEach(([dateStr, dateInfo]) => {
    const weekData = mealDataByMonth["2026-01"].weeks[dateInfo.week];
    if (!weekData) return;
    
    const mealInfo = weekData.meals[dateInfo.day];
    if (!mealInfo) return;
    
    // 중식
    if (mealInfo.lunch) {
      const menuParsed = parseMenu(mealInfo.lunch.menu);
      const nutrition = calculateNutrition(mealInfo.lunch.menu, "중식");
      
      allMeals.push({
        id: `meal-${idCounter++}`,
        date: dateStr,
        dayOfWeek: getDayOfWeek(dateStr),
        mealType: "중식",
        menu: menuParsed,
        nutrition,
        allergy: mealInfo.lunch.allergy,
        operation: {
          participationRate: 85 + Math.floor(Math.random() * 12),
          leftoverAmount: 120 + Math.floor(Math.random() * 80),
          satisfaction: 3.8 + Math.random() * 1.1
        },
        history: {
          createdBy: "AI 자동 생성",
          createdAt: `${dateStr} 08:30:00`,
          lastModifiedAt: `${dateStr} 08:30:00`,
          modificationReason: "없음"
        }
      });
    }
    
    // 석식
    if (mealInfo.dinner) {
      const menuParsed = parseMenu(mealInfo.dinner.menu);
      const nutrition = calculateNutrition(mealInfo.dinner.menu, "석식");
      
      allMeals.push({
        id: `meal-${idCounter++}`,
        date: dateStr,
        dayOfWeek: getDayOfWeek(dateStr),
        mealType: "석식",
        menu: menuParsed,
        nutrition,
        allergy: mealInfo.dinner.allergy,
        operation: {
          participationRate: 75 + Math.floor(Math.random() * 15),
          leftoverAmount: 150 + Math.floor(Math.random() * 100),
          satisfaction: 3.5 + Math.random() * 1.2
        },
        history: {
          createdBy: "AI 자동 생성",
          createdAt: `${dateStr} 08:30:00`,
          lastModifiedAt: `${dateStr} 08:30:00`,
          modificationReason: "없음"
        }
      });
    }
  });
  
  // 2025년 12월 처리
  Object.entries(dec2025Dates).forEach(([dateStr, dateInfo]) => {
    const weekData = mealDataByMonth["2025-12"].weeks[dateInfo.week];
    if (!weekData) return;
    
    const mealInfo = weekData.meals[dateInfo.day];
    if (!mealInfo) return;
    
    // 중식
    if (mealInfo.lunch) {
      const menuParsed = parseMenu(mealInfo.lunch.menu);
      const nutrition = calculateNutrition(mealInfo.lunch.menu, "중식");
      
      allMeals.push({
        id: `meal-${idCounter++}`,
        date: dateStr,
        dayOfWeek: getDayOfWeek(dateStr),
        mealType: "중식",
        menu: menuParsed,
        nutrition,
        allergy: mealInfo.lunch.allergy,
        operation: {
          participationRate: 85 + Math.floor(Math.random() * 12),
          leftoverAmount: 120 + Math.floor(Math.random() * 80),
          satisfaction: 3.8 + Math.random() * 1.1
        },
        history: {
          createdBy: "AI 자동 생성",
          createdAt: `${dateStr} 08:30:00`,
          lastModifiedAt: `${dateStr} 08:30:00`,
          modificationReason: "없음"
        }
      });
    }
    
    // 석식
    if (mealInfo.dinner) {
      const menuParsed = parseMenu(mealInfo.dinner.menu);
      const nutrition = calculateNutrition(mealInfo.dinner.menu, "석식");
      
      allMeals.push({
        id: `meal-${idCounter++}`,
        date: dateStr,
        dayOfWeek: getDayOfWeek(dateStr),
        mealType: "석식",
        menu: menuParsed,
        nutrition,
        allergy: mealInfo.dinner.allergy,
        operation: {
          participationRate: 75 + Math.floor(Math.random() * 15),
          leftoverAmount: 150 + Math.floor(Math.random() * 100),
          satisfaction: 3.5 + Math.random() * 1.2
        },
        history: {
          createdBy: "AI 자동 생성",
          createdAt: `${dateStr} 08:30:00`,
          lastModifiedAt: `${dateStr} 08:30:00`,
          modificationReason: "없음"
        }
      });
    }
  });
  
  return allMeals;
}

// 날짜 범위로 식단 필터링
export function getMealsByDateRange(startDate: string, endDate: string): MealDetail[] {
  const allMeals = generateAllMeals();
  return allMeals.filter(meal => 
    meal.date >= startDate && meal.date <= endDate
  ).sort((a, b) => b.date.localeCompare(a.date)); // 최신 날짜가 먼저
}

// ID로 식단 찾기
export function getMealById(id: string): MealDetail | undefined {
  const allMeals = generateAllMeals();
  return allMeals.find(meal => meal.id === id);
}
