import { useState } from 'react';
import { Info } from 'lucide-react';
import { MealDetailModal } from './MealDetailModal';

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
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "불고기", allergy: [5, 6] },
                { name: "콘나물무침", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "깍두기", allergy: [9] },
                { name: "우유", allergy: [2] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "고등어구이", allergy: [9] },
                { name: "시금치나물", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "상추쌈", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "계란말이", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨너겟", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "과일", allergy: [] }
              ]
            }
          }
        }
      },
      {
        "week": "2주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "닭갈비", allergy: [5, 6] },
                { name: "무생채", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "고등어구이", allergy: [9] },
                { name: "배추김치", allergy: [9] },
                { name: "요구르트", allergy: [] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "단무지", allergy: [] },
                { name: "치킨너겟", allergy: [1, 5, 15] },
                { name: "요구르트", allergy: [] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "불고기", allergy: [5, 6] },
                { name: "김치", allergy: [9] },
                { name: "과일", allergy: [] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "샐러드", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "생선구이", allergy: [9] },
                { name: "시금치나물", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "삼치구이", allergy: [9] },
                { name: "감자조림", allergy: [9] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "비빔밥", allergy: [1] },
                { name: "계란국", allergy: [1] },
                { name: "만두", allergy: [1, 5, 6] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "비빔밥", allergy: [1] },
                { name: "계란국", allergy: [1] },
                { name: "잡채", allergy: [1] },
                { name: "김가루", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "닭강정", allergy: [5, 6] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          }
        }
      },
      {
        "week": "3주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "두부조림", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "함박스테이크", allergy: [1, 5, 6, 10] },
                { name: "샐러드", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "된장국", allergy: [5, 6] },
                { name: "갈치구이", allergy: [9] },
                { name: "숙주나물", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "떡국", allergy: [] },
                { name: "불고기", allergy: [5, 6] },
                { name: "명란젓", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨가스", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "우유", allergy: [2] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "김치볶음밥", allergy: [1] },
                { name: "우동국물", allergy: [1] },
                { name: "탕수육", allergy: [1] },
                { name: "단무지", allergy: [] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "고등어조림", allergy: [9] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "간장치킨", allergy: [5, 6] },
                { name: "오이무침", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          }
        }
      },
      {
        "week": "4주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "고등어조림", allergy: [9] },
                { name: "시금치무침", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "닭볶음탕", allergy: [5, 6] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "양배추샐러드", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "비빔밥", allergy: [1] },
                { name: "된장국", allergy: [5, 6] },
                { name: "만두", allergy: [1, 5, 6] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "만두국", allergy: [] },
                { name: "닭볶음탕", allergy: [5, 6] },
                { name: "콘나물무침", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "불고기", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "단무지", allergy: [] },
                { name: "함박스테이크", allergy: [1, 5, 6, 10] },
                { name: "과일", allergy: [] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "고등어구이", allergy: [9] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "삼겹살구이", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "배추김치", allergy: [9] },
                { name: "요구르트", allergy: [] }
              ]
            }
          }
        }
      },
      {
        "week": "5주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "고추장불고기", allergy: [5, 6] },
                { name: "계란말이", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "샐러드", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "닭강정", allergy: [5, 6] },
                { name: "무생채", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨너겟", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "우유", allergy: [2] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "가자미구이", allergy: [5, 6] },
                { name: "김치전", allergy: [5, 6] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "볶음밥", allergy: [1] },
                { name: "짬뽕국", allergy: [1] },
                { name: "군만두", allergy: [1] },
                { name: "단무지", allergy: [] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "고등어구이", allergy: [9] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "오징어볶음", allergy: [5, 6] },
                { name: "두부무침", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "불고기", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
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
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "갈비찜", allergy: [5, 6] },
                { name: "오이무침", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "된장국", allergy: [5, 6] },
                { name: "생선구이", allergy: [9] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "닭강정", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "무생채", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "불고기", allergy: [5, 6] },
                { name: "콘나물무침", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨까스", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "과일", allergy: [] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "고등어조림", allergy: [9] },
                { name: "시금치나물", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "샐러드", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "삼치구이", allergy: [9] },
                { name: "계란찜", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "볶음밥", allergy: [1] },
                { name: "짜장", allergy: [1] },
                { name: "군만두", allergy: [1] },
                { name: "단무지", allergy: [] }
              ]
            }
          }
        }
      },
      {
        "week": "2주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "닭갈비", allergy: [5, 6] },
                { name: "무생채", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "고등어구이", allergy: [9] },
                { name: "깍두기", allergy: [9] },
                { name: "우유", allergy: [2] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "함박스테이크", allergy: [1, 5, 6, 10] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "된장국", allergy: [5, 6] },
                { name: "오징어볶음", allergy: [5, 6] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "콘나물무침", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨너겟", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "요구르트", allergy: [] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "갈치구이", allergy: [9] },
                { name: "감자조림", allergy: [9] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "비빔밥", allergy: [1] },
                { name: "계란국", allergy: [1] },
                { name: "만두", allergy: [1, 5, 6] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "간장치킨", allergy: [5, 6] },
                { name: "오이무침", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "불고기", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          }
        }
      },
      {
        "week": "3주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "삼겹살구이", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "된장국", allergy: [5, 6] },
                { name: "고등어조림", allergy: [9] },
                { name: "시금치나물", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "양배추샐러드", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "닭볶음탕", allergy: [5, 6] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "가자미구이", allergy: [5, 6] },
                { name: "무생채", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "함박스테이크", allergy: [1, 5, 6, 10] },
                { name: "단무지", allergy: [] },
                { name: "우유", allergy: [2] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "계란말이", allergy: [1] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "김치볶음밥", allergy: [1] },
                { name: "우동국물", allergy: [1] },
                { name: "탕수육", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "삼치구이", allergy: [9] },
                { name: "콘나물무침", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "불고기", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          }
        }
      },
      {
        "week": "4주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "닭강정", allergy: [5, 6] },
                { name: "무생채", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "고등어구이", allergy: [9] },
                { name: "깍두기", allergy: [9] },
                { name: "요구르트", allergy: [] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "샐러드", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "된장국", allergy: [5, 6] },
                { name: "오징어볶음", allergy: [5, 6] },
                { name: "두부무침", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "계란찜", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨가스", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "과일", allergy: [] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "갈치구이", allergy: [9] },
                { name: "시금치나물", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "비빔밥", allergy: [1] },
                { name: "계란국", allergy: [1] },
                { name: "만두", allergy: [1, 5, 6] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "삼겹살구이", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "불고기", allergy: [5, 6] },
                { name: "무생채", allergy: [5] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          }
        }
      },
      {
        "week": "5주차",
        "meals": {
          "월": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "된장찌개", allergy: [5, 6] },
                { name: "고등어조림", allergy: [9] },
                { name: "콘나물무침", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "육개장", allergy: [5, 6, 16] },
                { name: "닭볶음탕", allergy: [5, 6] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "화": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "함박스테이크", allergy: [1, 5, 6, 10] },
                { name: "샐러드", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "미역국", allergy: [] },
                { name: "제육볶음", allergy: [5, 6, 10] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          },
          "수": {
            "lunch": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "김치찌개", allergy: [5, 9, 10] },
                { name: "돈까스", allergy: [1, 5, 6, 10] },
                { name: "오이무침", allergy: [] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "카레라이스", allergy: [2, 5, 6] },
                { name: "치킨너겟", allergy: [1, 5, 15] },
                { name: "단무지", allergy: [] },
                { name: "우유", allergy: [2] }
              ]
            }
          },
          "목": {
            "lunch": {
              "menu": [
                { name: "흰쌀밥", allergy: [] },
                { name: "콘나물국", allergy: [5] },
                { name: "삼치구이", allergy: [9] },
                { name: "감자조림", allergy: [9] },
                { name: "깍두기", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "볶음밥", allergy: [1] },
                { name: "짬뽕국", allergy: [1] },
                { name: "군만두", allergy: [1] },
                { name: "배추김치", allergy: [9] }
              ]
            }
          },
          "금": {
            "lunch": {
              "menu": [
                { name: "잡곡밥", allergy: [] },
                { name: "된장국", allergy: [5, 6] },
                { name: "갈치구이", allergy: [9] },
                { name: "시금치나물", allergy: [5] },
                { name: "배추김치", allergy: [9] }
              ]
            },
            "dinner": {
              "menu": [
                { name: "현미밥", allergy: [] },
                { name: "순두부찌개", allergy: [5] },
                { name: "불고기", allergy: [5, 6] },
                { name: "상추쌈", allergy: [] },
                { name: "깍두기", allergy: [9] }
              ]
            }
          }
        }
      }
    ]
  }
};

interface EditMealModalProps {
  day: string;
  week: string;
  mealType: 'lunch' | 'dinner';
  mealData: { menu: Array<{ name: string; allergy: number[] }> };
  onClose: () => void;
  onSave: (updatedData: { menu: Array<{ name: string; allergy: number[] }> }) => void;
}

function EditMealModal({ day, week, mealType, mealData, onClose, onSave }: EditMealModalProps) {
  const [menuItems, setMenuItems] = useState(mealData.menu);

  const handleAddItem = () => {
    setMenuItems([...menuItems, { name: '', allergy: [] }]);
  };

  const handleRemoveItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((_, i) => i !== index));
    }
  };

  const handleItemNameChange = (index: number, name: string) => {
    const updated = [...menuItems];
    updated[index].name = name;
    setMenuItems(updated);
  };

  const handleItemAllergyChange = (index: number, allergyStr: string) => {
    const updated = [...menuItems];
    const allergyArray = allergyStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    updated[index].allergy = allergyArray;
    setMenuItems(updated);
  };

  const handleSave = () => {
    onSave({ menu: menuItems });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-medium mb-4 pb-2 border-b border-gray-200">
          식단 수정
        </h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <span className="text-sm text-gray-600">주차: </span>
            <span className="font-medium">{week}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">요일: </span>
            <span className="font-medium">{day}요일</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">식사 유형: </span>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              mealType === 'lunch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {mealType === 'lunch' ? '중식' : '석식'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">메뉴 항목</label>
            <Button
              size="sm"
              onClick={handleAddItem}
              className="bg-[#5dccb4] hover:bg-[#4dbba3] text-white"
            >
              + 항목 추가
            </Button>
          </div>

          {menuItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">항목 {index + 1}</span>
                {menuItems.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">음식명</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemNameChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="예: 흰쌀밥"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">
                    알레르기 정보 (숫자, 쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={item.allergy.join(', ')}
                    onChange={(e) => handleItemAllergyChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#5dccb4]"
                    placeholder="예: 1, 5, 6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} className="bg-[#5dccb4] hover:bg-[#4dbba3]">
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MealMonthlyCalendar() {
  const weekDays = ['월', '화', '수', '목', '금'];
  const [currentMonth, setCurrentMonth] = useState("2026-01");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [editingMeal, setEditingMeal] = useState<{
    weekIdx: number;
    day: string;
    mealType: 'lunch' | 'dinner';
    data: { menu: Array<{ name: string; allergy: number[] }> };
  } | null>(null);
  const [detailMeal, setDetailMeal] = useState<{
    week: string;
    day: string;
    mealType: 'lunch' | 'dinner';
    data: { menu: Array<{ name: string; allergy: number[] }> };
  } | null>(null);

  const handleEditMeal = (weekIdx: number, day: string, mealType: 'lunch' | 'dinner', data: { menu: Array<{ name: string; allergy: number[] }> }) => {
    setEditingMeal({ weekIdx, day, mealType, data });
  };

  const handleDetailMeal = (week: string, day: string, mealType: 'lunch' | 'dinner', data: { menu: Array<{ name: string; allergy: number[] }> }) => {
    setDetailMeal({ week, day, mealType, data });
  };

  const handleSaveMeal = (updatedData: { menu: Array<{ name: string; allergy: number[] }> }) => {
    if (!editingMeal) return;
    
    // 실제 구현에서는 여기서 상태를 업데이트하거나 API를 호출합니다
    console.log('Saving meal:', editingMeal, updatedData);
    alert('식단이 저장되었습니다.');
    setEditingMeal(null);
  };

  const handlePrevMonth = () => {
    const currentYear = parseInt(currentMonth.split('-')[0]);
    const currentMonthNum = parseInt(currentMonth.split('-')[1]);
    let newMonthNum = currentMonthNum - 1;
    let newYear = currentYear;

    if (newMonthNum < 1) {
      newMonthNum = 12;
      newYear -= 1;
    }

    const newMonth = `${newYear}-${newMonthNum.toString().padStart(2, '0')}`;
    
    // Only change month if data exists
    if (mealDataByMonth[newMonth]) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const currentYear = parseInt(currentMonth.split('-')[0]);
    const currentMonthNum = parseInt(currentMonth.split('-')[1]);
    let newMonthNum = currentMonthNum + 1;
    let newYear = currentYear;

    if (newMonthNum > 12) {
      newMonthNum = 1;
      newYear += 1;
    }

    const newMonth = `${newYear}-${newMonthNum.toString().padStart(2, '0')}`;
    
    // Only change month if data exists
    if (mealDataByMonth[newMonth]) {
      setCurrentMonth(newMonth);
    }
  };

  const mealData = mealDataByMonth[currentMonth];

  // If no data for current month, return error message
  if (!mealData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">해당 월의 식단 데이터가 없습니다.</p>
      </div>
    );
  }

  // Filter weeks based on selected week
  const displayWeeks = selectedWeek !== null 
    ? mealData.weeks.filter((_, idx) => idx === selectedWeek)
    : mealData.weeks;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">{mealData.month} 월간 식단표</h2>
            <p className="text-sm text-gray-600 mt-1">대상: {mealData.target}</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={handlePrevMonth}>
              이전 달
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50" onClick={handleNextMonth}>
              다음 달
            </button>
          </div>
        </div>
      </div>

      {/* Week Filter Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded ${
              selectedWeek === null
                ? 'bg-[#5dccb4] text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedWeek(null)}
          >
            전체
          </button>
          {mealData.weeks.map((weekData, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded ${
                selectedWeek === idx
                  ? 'bg-[#5dccb4] text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedWeek(idx)}
            >
              {weekData.week}
            </button>
          ))}
        </div>
      </div>

      {/* Week by Week Layout */}
      <div className="space-y-6">
        {displayWeeks.map((weekData, weekIdx) => (
          <div key={weekIdx} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              {weekData.week}
            </h3>
            
            <div className="grid grid-cols-5 gap-4">
              {weekDays.map((day) => {
                const mealInfo = weekData.meals[day];
                const actualWeekIdx = selectedWeek !== null ? selectedWeek : mealData.weeks.indexOf(weekData);
                
                return (
                  <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Day Header */}
                    <div className="bg-[#5dccb4] text-white text-center py-2 font-medium">
                      {day}요일
                    </div>
                    
                    {/* Meal Content */}
                    {mealInfo ? (
                      <div className="p-4 flex flex-col">
                        {/* 중식 */}
                        <div className="pb-4 border-b border-gray-200 flex flex-col">
                          <div className="h-6 mb-2 flex items-center justify-between flex-shrink-0">
                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                              중식
                            </span>
                          </div>
                          <div className="text-sm text-gray-800 leading-relaxed space-y-1 flex-1 mb-2">
                            {mealInfo.lunch.menu.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span>{item.name}</span>
                                {item.allergy && item.allergy.length > 0 && (
                                  <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                                    {item.allergy.join(',')}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleDetailMeal(weekData.week, day, 'lunch', mealInfo.lunch)}
                            className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>상세보기</span>
                          </button>
                        </div>

                        {/* 석식 */}
                        <div className="pt-4 flex flex-col">
                          <div className="h-6 mb-2 flex items-center justify-between flex-shrink-0">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              석식
                            </span>
                          </div>
                          <div className="text-sm text-gray-800 leading-relaxed space-y-1 flex-1 mb-2">
                            {mealInfo.dinner.menu.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span>{item.name}</span>
                                {item.allergy && item.allergy.length > 0 && (
                                  <span className="text-xs text-gray-600 bg-[#FCE8E6] px-1 py-0.5 rounded flex-shrink-0">
                                    {item.allergy.join(',')}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleDetailMeal(weekData.week, day, 'dinner', mealInfo.dinner)}
                            className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-[#5dccb4] hover:bg-[#5dccb4]/5 rounded transition-colors flex-shrink-0"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>상세보기</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        식단 없음
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Meal Modal */}
      {editingMeal && (
        <EditMealModal
          day={editingMeal.day}
          week={editingMeal.week}
          mealType={editingMeal.mealType}
          mealData={editingMeal.data}
          onClose={() => setEditingMeal(null)}
          onSave={handleSaveMeal}
        />
      )}

      {/* Detail Meal Modal */}
      {detailMeal && (
        <MealDetailModal
          day={detailMeal.day}
          week={detailMeal.week}
          mealType={detailMeal.mealType}
          mealData={detailMeal.data}
          onClose={() => setDetailMeal(null)}
        />
      )}
    </div>
  );
}