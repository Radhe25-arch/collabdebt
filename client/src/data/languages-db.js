/**
 * SkillForge Global Language Library Database
 * 250+ Active Coding Languages with Standardized 4-Tier Syllabus
 */

const createSyllabus = (found, logic, adv, real) => ({
  1: { title: "FOUNDATION", topics: found },
  2: { title: "LOGIC", topics: logic },
  3: { title: "ADVANCED", topics: adv },
  4: { title: "REAL-WORLD", topics: real },
});

export const LANGUAGES = [
  {
    "id": "java",
    "name": "Java",
    "year": 1995,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Object-oriented, class-based, designed for portability.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c_",
    "name": "C#",
    "year": 2000,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Modern OOP language focus on .NET framework.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "php",
    "name": "PHP",
    "year": 1994,
    "creator": "Rasmus Lerdorf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Web"
    ],
    "difficulty": "Basic",
    "color": "#4F5D95",
    "description": "The server-side language that powers much of the web.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "ruby",
    "name": "Ruby",
    "year": 1995,
    "creator": "Yukihiro Matsumoto",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Web"
    ],
    "difficulty": "Basic",
    "color": "#CC342D",
    "description": "Designed for developer happiness and productivity.",
    "parent": [
      "Perl"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "go",
    "name": "Go",
    "year": 2009,
    "creator": "Google",
    "paradigms": [
      "Concurrent"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#00ADD8",
    "description": "Statically typed, simple, and high-performance server-side language.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "swift",
    "name": "Swift",
    "year": 2014,
    "creator": "Apple",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Intermediate",
    "color": "#F05138",
    "description": "Safe, fast, and modern language for Apple systems.",
    "parent": [
      "Obj-C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "kotlin",
    "name": "Kotlin",
    "year": 2011,
    "creator": "JetBrains",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#7F52FF",
    "description": "Concise, safe, and interoperable language for Android.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "objective_c",
    "name": "Objective-C",
    "year": 1984,
    "creator": "Brad Cox",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Advanced",
    "color": "#438EFF",
    "description": "Superset of C with Smalltalk-style messaging.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "haskell",
    "name": "Haskell",
    "year": 1990,
    "creator": "Committee",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#5E5086",
    "description": "Pure functional language with lazy evaluation.",
    "parent": [
      "Miranda"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "scala",
    "name": "Scala",
    "year": 2004,
    "creator": "Martin Odersky",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Advanced",
    "color": "#DE3423",
    "description": "Combines OOP and Functional on the JVM.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "perl",
    "name": "Perl",
    "year": 1987,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Powerful text-processing and glue language.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "sql",
    "name": "SQL",
    "year": 1974,
    "creator": "IBM",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#4479A1",
    "description": "Standard language for managing databases.",
    "parent": [
      "Datalog"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "visual_basic",
    "name": "Visual Basic",
    "year": 1991,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Basic",
    "color": "#003399",
    "description": "Event-driven language focus on quick UI.",
    "parent": [
      "BASIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r",
    "name": "R",
    "year": 1993,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Standard for statistical computing.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "lua",
    "name": "Lua",
    "year": 1993,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Lightweight scripting frequently used for game engines.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "dart",
    "name": "Dart",
    "year": 2011,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Optimized for mobile-app UI development.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "f_",
    "name": "F#",
    "year": 2005,
    "creator": "Don Syme",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#30B9DB",
    "description": "Functional-first language for .NET.",
    "parent": [
      "OCaml"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "ada",
    "name": "Ada",
    "year": 1980,
    "creator": "Jean Ichbiah",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#02F882",
    "description": "Statically typed language with focus on safety.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "assembly",
    "name": "Assembly",
    "year": 1949,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "The lowest-level readable code.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran",
    "name": "Fortran",
    "year": 1957,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Formula Translation. Still standard in numeric science.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "pascal",
    "name": "Pascal",
    "year": 1970,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Basic",
    "color": "#E3F171",
    "description": "Classic language used widely for education.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "smalltalk",
    "name": "Smalltalk",
    "year": 1972,
    "creator": "Alan Kay",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#A2190E",
    "description": "Pure Object-Orientation pioneer.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "cobol",
    "name": "COBOL",
    "year": 1959,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "The language of business mainframes.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lisp",
    "name": "LISP",
    "year": 1958,
    "creator": "John McCarthy",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "AI"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "The second oldest high-level language.",
    "parent": [
      "IPL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "scheme",
    "name": "Scheme",
    "year": 1975,
    "creator": "Guy Steele",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Advanced",
    "color": "#1E4BBD",
    "description": "Minimalistic Lisp dialect.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "prolog",
    "name": "Prolog",
    "year": 1972,
    "creator": "Colmerauer",
    "paradigms": [
      "Logic"
    ],
    "usage": [
      "AI"
    ],
    "difficulty": "Advanced",
    "color": "#74283C",
    "description": "Logic programming for AI and NLP.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "apl",
    "name": "APL",
    "year": 1964,
    "creator": "Kenneth Iverson",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#8A1703",
    "description": "Array-based notation pioneer.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "forth",
    "name": "Forth",
    "year": 1970,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Stack-based, extensible, and efficient.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "logo",
    "name": "Logo",
    "year": 1967,
    "creator": "Wally Feurzeig",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Basic",
    "color": "#FF7600",
    "description": "Turtle graphics and educational Lisp.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "sas",
    "name": "SAS",
    "year": 1976,
    "creator": "SAS Institute",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Intermediate",
    "color": "#005EB8",
    "description": "Dominant in business analytics.",
    "parent": [
      "FORTRAN"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "postscript",
    "name": "PostScript",
    "year": 1982,
    "creator": "Adobe",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Printing"
    ],
    "difficulty": "Advanced",
    "color": "#DA1F26",
    "description": "Page description for digital publishing.",
    "parent": [
      "Forth"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "tcl",
    "name": "Tcl",
    "year": 1988,
    "creator": "John Ousterhout",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Basic",
    "color": "#236FC4",
    "description": "Tool Command Language, extremely portable.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "erlang",
    "name": "Erlang",
    "year": 1986,
    "creator": "Joe Armstrong",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Distributed"
    ],
    "difficulty": "Advanced",
    "color": "#A90533",
    "description": "Designed for fault-tolerant massive systems.",
    "parent": [
      "Prolog"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "modula_2",
    "name": "Modula-2",
    "year": 1978,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Modular successor to Pascal.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "algol",
    "name": "ALGOL",
    "year": 1960,
    "creator": "Committee",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "The block-structure pioneer.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "ocaml",
    "name": "OCaml",
    "year": 1996,
    "creator": "INRIA",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#EB8B12",
    "description": "Objective Caml. Powerful type system.",
    "parent": [
      "ML"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "clojure",
    "name": "Clojure",
    "year": 2007,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Modern Lisp for the JVM.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "julia",
    "name": "Julia",
    "year": 2012,
    "creator": "Viral Shah",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#9558B2",
    "description": "High-performance science language.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "nim",
    "name": "Nim",
    "year": 2008,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Compiles to C, C++, or JS.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "zig",
    "name": "Zig",
    "year": 2016,
    "creator": "Andrew Kelley",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Advanced",
    "color": "#F7A41D",
    "description": "The modern alternative to C.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "solidity",
    "name": "Solidity",
    "year": 2014,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "The contract language of Ethereum.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "brainfuck",
    "name": "Brainfuck",
    "year": 1993,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Extremely Minimalist, 8 commands.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "malbolge",
    "name": "Malbolge",
    "year": 1998,
    "creator": "Ben Olmstead",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Developed to be impossible to write.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "chef",
    "name": "Chef",
    "year": 2002,
    "creator": "David Morgan-Mar",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#CD7F32",
    "description": "Programs that read like recipes.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "forth_x_44",
    "name": "Forth X",
    "year": 1974,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized X version of Forth, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45",
    "name": "Assembly Next",
    "year": 1950,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Next version of Assembly, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "visual_basic_v2_46",
    "name": "Visual Basic v2",
    "year": 1997,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Basic",
    "color": "#003399",
    "description": "Highly specialized v2 version of Visual Basic, enhanced for modern Enterprise architecture.",
    "parent": [
      "BASIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_pro_47",
    "name": "Clojure Pro",
    "year": 2015,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Pro version of Clojure, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "r_ii_48",
    "name": "R II",
    "year": 2000,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized II version of R, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "java_z_49",
    "name": "Java Z",
    "year": 2003,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Z version of Java, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scheme_pro_50",
    "name": "Scheme Pro",
    "year": 1975,
    "creator": "Guy Steele",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Advanced",
    "color": "#1E4BBD",
    "description": "Highly specialized Pro version of Scheme, enhanced for modern Academic architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51",
    "name": "Nim Industrial",
    "year": 2013,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Industrial version of Nim, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52",
    "name": "Perl Pro",
    "year": 1988,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Pro version of Perl, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_z_53",
    "name": "Assembly Next Z",
    "year": 1953,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Z version of Assembly Next, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54",
    "name": "Fortran Next",
    "year": 1964,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Next version of Fortran, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "haskell_pro_55",
    "name": "Haskell Pro",
    "year": 1996,
    "creator": "Committee",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#5E5086",
    "description": "Highly specialized Pro version of Haskell, enhanced for modern Scientific architecture.",
    "parent": [
      "Miranda"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "nim_ii_56",
    "name": "Nim II",
    "year": 2015,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized II version of Nim, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "cobol_elite_57",
    "name": "COBOL Elite",
    "year": 1962,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized Elite version of COBOL, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_pro_47_prime_58",
    "name": "Clojure Pro Prime",
    "year": 2019,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Prime version of Clojure Pro, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_59",
    "name": "COBOL v2",
    "year": 1960,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized v2 version of COBOL, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c__x_60",
    "name": "C# X",
    "year": 2002,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized X version of C#, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "haskell_elite_61",
    "name": "Haskell Elite",
    "year": 1990,
    "creator": "Committee",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#5E5086",
    "description": "Highly specialized Elite version of Haskell, enhanced for modern Scientific architecture.",
    "parent": [
      "Miranda"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "prolog_prime_62",
    "name": "Prolog Prime",
    "year": 1974,
    "creator": "Colmerauer",
    "paradigms": [
      "Logic"
    ],
    "usage": [
      "AI"
    ],
    "difficulty": "Advanced",
    "color": "#74283C",
    "description": "Highly specialized Prime version of Prolog, enhanced for modern AI architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "modula_2_z_63",
    "name": "Modula-2 Z",
    "year": 1986,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized Z version of Modula-2, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_industrial_64",
    "name": "Perl Pro Industrial",
    "year": 1994,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Industrial version of Perl Pro, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65",
    "name": "Java Industrial",
    "year": 1996,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Industrial version of Java, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "objective_c_z_66",
    "name": "Objective-C Z",
    "year": 1986,
    "creator": "Brad Cox",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Advanced",
    "color": "#438EFF",
    "description": "Highly specialized Z version of Objective-C, enhanced for modern Mobile architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_ii_67",
    "name": "Java Industrial II",
    "year": 2004,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized II version of Java Industrial, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "brainfuck_pro_68",
    "name": "Brainfuck Pro",
    "year": 2001,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Pro version of Brainfuck, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c__x_60_legacy_69",
    "name": "C# X Legacy",
    "year": 2002,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized Legacy version of C# X, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "dart_elite_70",
    "name": "Dart Elite",
    "year": 2016,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Highly specialized Elite version of Dart, enhanced for modern Mobile architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_next_71",
    "name": "Fortran Next Next",
    "year": 1965,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Next version of Fortran Next, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "julia_industrial_72",
    "name": "Julia Industrial",
    "year": 2014,
    "creator": "Viral Shah",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#9558B2",
    "description": "Highly specialized Industrial version of Julia, enhanced for modern Scientific architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73",
    "name": "Fortran II",
    "year": 1961,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized II version of Fortran, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_74",
    "name": "Assembly Next X",
    "year": 1958,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized X version of Assembly Next, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "r_industrial_75",
    "name": "R Industrial",
    "year": 1997,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Industrial version of R, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_alpha_76",
    "name": "Java Industrial Alpha",
    "year": 1999,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Alpha version of Java Industrial, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "kotlin_industrial_77",
    "name": "Kotlin Industrial",
    "year": 2013,
    "creator": "JetBrains",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#7F52FF",
    "description": "Highly specialized Industrial version of Kotlin, enhanced for modern Mobile architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scala_z_78",
    "name": "Scala Z",
    "year": 2005,
    "creator": "Martin Odersky",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Advanced",
    "color": "#DE3423",
    "description": "Highly specialized Z version of Scala, enhanced for modern Data architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_alpha_76_pro_79",
    "name": "Java Industrial Alpha Pro",
    "year": 2006,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Pro version of Java Industrial Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lua_next_80",
    "name": "Lua Next",
    "year": 1998,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized Next version of Lua, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_alpha_76_alpha_81",
    "name": "Java Industrial Alpha Alpha",
    "year": 2007,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Alpha version of Java Industrial Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "brainfuck_pro_68_v2_82",
    "name": "Brainfuck Pro v2",
    "year": 2005,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized v2 version of Brainfuck Pro, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_83",
    "name": "COBOL v2",
    "year": 1964,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized v2 version of COBOL, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "f__elite_84",
    "name": "F# Elite",
    "year": 2009,
    "creator": "Don Syme",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#30B9DB",
    "description": "Highly specialized Elite version of F#, enhanced for modern Enterprise architecture.",
    "parent": [
      "OCaml"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_59_prime_85",
    "name": "COBOL v2 Prime",
    "year": 1961,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized Prime version of COBOL v2, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "smalltalk_pro_86",
    "name": "Smalltalk Pro",
    "year": 1972,
    "creator": "Alan Kay",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#A2190E",
    "description": "Highly specialized Pro version of Smalltalk, enhanced for modern Research architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lisp_elite_87",
    "name": "LISP Elite",
    "year": 1961,
    "creator": "John McCarthy",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "AI"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "Highly specialized Elite version of LISP, enhanced for modern AI architecture.",
    "parent": [
      "IPL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "ada_legacy_88",
    "name": "Ada Legacy",
    "year": 1983,
    "creator": "Jean Ichbiah",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#02F882",
    "description": "Highly specialized Legacy version of Ada, enhanced for modern Embedded architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_74_x_89",
    "name": "Assembly Next X X",
    "year": 1963,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized X version of Assembly Next X, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "c__x_60_legacy_69_v2_90",
    "name": "C# X Legacy v2",
    "year": 2007,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized v2 version of C# X Legacy, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "zig_alpha_91",
    "name": "Zig Alpha",
    "year": 2018,
    "creator": "Andrew Kelley",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Advanced",
    "color": "#F7A41D",
    "description": "Highly specialized Alpha version of Zig, enhanced for modern Systems architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_ii_92",
    "name": "Nim Industrial II",
    "year": 2020,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized II version of Nim Industrial, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "go_legacy_93",
    "name": "Go Legacy",
    "year": 2017,
    "creator": "Google",
    "paradigms": [
      "Concurrent"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#00ADD8",
    "description": "Highly specialized Legacy version of Go, enhanced for modern Systems architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94",
    "name": "Fortran Next Legacy",
    "year": 1970,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Legacy version of Fortran Next, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_prime_95",
    "name": "Nim Industrial Prime",
    "year": 2015,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Prime version of Nim Industrial, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "solidity_z_96",
    "name": "Solidity Z",
    "year": 2018,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Z version of Solidity, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97",
    "name": "Clojure X",
    "year": 2011,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized X version of Clojure, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_industrial_98",
    "name": "Forth X Industrial",
    "year": 1980,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized Industrial version of Forth X, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_next_71_legacy_99",
    "name": "Fortran Next Next Legacy",
    "year": 1970,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Legacy version of Fortran Next Next, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r_ii_48_alpha_100",
    "name": "R II Alpha",
    "year": 2000,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Alpha version of R II, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "ocaml_industrial_101",
    "name": "OCaml Industrial",
    "year": 2004,
    "creator": "INRIA",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#EB8B12",
    "description": "Highly specialized Industrial version of OCaml, enhanced for modern Scientific architecture.",
    "parent": [
      "ML"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_alpha_76_pro_79_v2_102",
    "name": "Java Industrial Alpha Pro v2",
    "year": 2007,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized v2 version of Java Industrial Alpha Pro, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_74_x_89_x_103",
    "name": "Assembly Next X X X",
    "year": 1966,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized X version of Assembly Next X X, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "r_ii_104",
    "name": "R II",
    "year": 1998,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized II version of R, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "ocaml_legacy_105",
    "name": "OCaml Legacy",
    "year": 2001,
    "creator": "INRIA",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#EB8B12",
    "description": "Highly specialized Legacy version of OCaml, enhanced for modern Scientific architecture.",
    "parent": [
      "ML"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_pro_106",
    "name": "Forth X Pro",
    "year": 1983,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized Pro version of Forth X, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "tcl_industrial_107",
    "name": "Tcl Industrial",
    "year": 1994,
    "creator": "John Ousterhout",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Basic",
    "color": "#236FC4",
    "description": "Highly specialized Industrial version of Tcl, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lua_legacy_108",
    "name": "Lua Legacy",
    "year": 1999,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized Legacy version of Lua, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_prime_109",
    "name": "Assembly Prime",
    "year": 1949,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Prime version of Assembly, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73_prime_110",
    "name": "Fortran II Prime",
    "year": 1969,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Prime version of Fortran II, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_industrial_64_industrial_111",
    "name": "Perl Pro Industrial Industrial",
    "year": 1999,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Industrial version of Perl Pro Industrial, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "solidity_z_96_industrial_112",
    "name": "Solidity Z Industrial",
    "year": 2018,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Industrial version of Solidity Z, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113",
    "name": "Perl Pro Legacy",
    "year": 1995,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Legacy version of Perl Pro, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_59_prime_85_x_114",
    "name": "COBOL v2 Prime X",
    "year": 1961,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized X version of COBOL v2 Prime, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lua_prime_115",
    "name": "Lua Prime",
    "year": 2001,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized Prime version of Lua, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r_ii_104_legacy_116",
    "name": "R II Legacy",
    "year": 2002,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Legacy version of R II, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_74_prime_117",
    "name": "Assembly Next X Prime",
    "year": 1959,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Prime version of Assembly Next X, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_prime_118",
    "name": "Fortran Next Prime",
    "year": 1967,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Prime version of Fortran Next, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73_z_119",
    "name": "Fortran II Z",
    "year": 1962,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Z version of Fortran II, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_z_120",
    "name": "Nim Industrial Z",
    "year": 2014,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Z version of Nim Industrial, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "apl_industrial_121",
    "name": "APL Industrial",
    "year": 1971,
    "creator": "Kenneth Iverson",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#8A1703",
    "description": "Highly specialized Industrial version of APL, enhanced for modern Scientific architecture.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "r_ii_104_legacy_116_pro_122",
    "name": "R II Legacy Pro",
    "year": 2008,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Pro version of R II Legacy, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "c__x_60_v2_123",
    "name": "C# X v2",
    "year": 2007,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized v2 version of C# X, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94_industrial_124",
    "name": "Fortran Next Legacy Industrial",
    "year": 1972,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Industrial version of Fortran Next Legacy, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r_industrial_75_legacy_125",
    "name": "R Industrial Legacy",
    "year": 2005,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Legacy version of R Industrial, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "solidity_z_96_industrial_112_z_126",
    "name": "Solidity Z Industrial Z",
    "year": 2018,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Z version of Solidity Z Industrial, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "cobol_elite_57_pro_127",
    "name": "COBOL Elite Pro",
    "year": 1966,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized Pro version of COBOL Elite, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_59_prime_85_alpha_128",
    "name": "COBOL v2 Prime Alpha",
    "year": 1970,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized Alpha version of COBOL v2 Prime, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "dart_elite_70_prime_129",
    "name": "Dart Elite Prime",
    "year": 2023,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Highly specialized Prime version of Dart Elite, enhanced for modern Mobile architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97_alpha_130",
    "name": "Clojure X Alpha",
    "year": 2019,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Alpha version of Clojure X, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_pro_106_z_131",
    "name": "Forth X Pro Z",
    "year": 1992,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized Z version of Forth X Pro, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "c__alpha_132",
    "name": "C# Alpha",
    "year": 2005,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized Alpha version of C#, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_alpha_76_pro_133",
    "name": "Java Industrial Alpha Pro",
    "year": 2003,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Pro version of Java Industrial Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_industrial_98_x_134",
    "name": "Forth X Industrial X",
    "year": 1981,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized X version of Forth X Industrial, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "solidity_z_135",
    "name": "Solidity Z",
    "year": 2019,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Z version of Solidity, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "go_elite_136",
    "name": "Go Elite",
    "year": 2012,
    "creator": "Google",
    "paradigms": [
      "Concurrent"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#00ADD8",
    "description": "Highly specialized Elite version of Go, enhanced for modern Systems architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "smalltalk_pro_86_pro_137",
    "name": "Smalltalk Pro Pro",
    "year": 1978,
    "creator": "Alan Kay",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#A2190E",
    "description": "Highly specialized Pro version of Smalltalk Pro, enhanced for modern Research architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "haskell_elite_138",
    "name": "Haskell Elite",
    "year": 1996,
    "creator": "Committee",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#5E5086",
    "description": "Highly specialized Elite version of Haskell, enhanced for modern Scientific architecture.",
    "parent": [
      "Miranda"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "modula_2_v2_139",
    "name": "Modula-2 v2",
    "year": 1981,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized v2 version of Modula-2, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "brainfuck_pro_68_v2_140",
    "name": "Brainfuck Pro v2",
    "year": 2006,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized v2 version of Brainfuck Pro, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "pascal_alpha_141",
    "name": "Pascal Alpha",
    "year": 1973,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Basic",
    "color": "#E3F171",
    "description": "Highly specialized Alpha version of Pascal, enhanced for modern Academic architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r_ii_104_z_142",
    "name": "R II Z",
    "year": 2001,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Z version of R II, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "java_next_143",
    "name": "Java Next",
    "year": 2000,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Next version of Java, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "smalltalk_pro_86_next_144",
    "name": "Smalltalk Pro Next",
    "year": 1976,
    "creator": "Alan Kay",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#A2190E",
    "description": "Highly specialized Next version of Smalltalk Pro, enhanced for modern Research architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "java_z_49_prime_145",
    "name": "Java Z Prime",
    "year": 2003,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Prime version of Java Z, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "algol_prime_146",
    "name": "ALGOL Prime",
    "year": 1961,
    "creator": "Committee",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "Highly specialized Prime version of ALGOL, enhanced for modern Research architecture.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lua_legacy_108_industrial_147",
    "name": "Lua Legacy Industrial",
    "year": 2002,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized Industrial version of Lua Legacy, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_legacy_148",
    "name": "Perl Legacy",
    "year": 1993,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Legacy version of Perl, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c__x_60_legacy_69_elite_149",
    "name": "C# X Legacy Elite",
    "year": 2009,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized Elite version of C# X Legacy, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "solidity_z_135_elite_150",
    "name": "Solidity Z Elite",
    "year": 2027,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Elite version of Solidity Z, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scheme_pro_50_alpha_151",
    "name": "Scheme Pro Alpha",
    "year": 1981,
    "creator": "Guy Steele",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Advanced",
    "color": "#1E4BBD",
    "description": "Highly specialized Alpha version of Scheme Pro, enhanced for modern Academic architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152",
    "name": "Perl Pro Legacy Elite",
    "year": 1998,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Elite version of Perl Pro Legacy, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_x_153",
    "name": "Perl Pro X",
    "year": 1997,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized X version of Perl Pro, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_z_154",
    "name": "Assembly Z",
    "year": 1953,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Z version of Assembly, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "modula_2_v2_139_z_155",
    "name": "Modula-2 v2 Z",
    "year": 1983,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized Z version of Modula-2 v2, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "tcl_pro_156",
    "name": "Tcl Pro",
    "year": 1993,
    "creator": "John Ousterhout",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Basic",
    "color": "#236FC4",
    "description": "Highly specialized Pro version of Tcl, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scheme_prime_157",
    "name": "Scheme Prime",
    "year": 1977,
    "creator": "Guy Steele",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Advanced",
    "color": "#1E4BBD",
    "description": "Highly specialized Prime version of Scheme, enhanced for modern Academic architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "malbolge_legacy_158",
    "name": "Malbolge Legacy",
    "year": 2004,
    "creator": "Ben Olmstead",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Legacy version of Malbolge, enhanced for modern Challenge architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_z_120_next_159",
    "name": "Nim Industrial Z Next",
    "year": 2017,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Next version of Nim Industrial Z, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "brainfuck_alpha_160",
    "name": "Brainfuck Alpha",
    "year": 2000,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Alpha version of Brainfuck, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r_industrial_75_v2_161",
    "name": "R Industrial v2",
    "year": 1998,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized v2 version of R Industrial, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_ii_67_v2_162",
    "name": "Java Industrial II v2",
    "year": 2013,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized v2 version of Java Industrial II, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "algol_elite_163",
    "name": "ALGOL Elite",
    "year": 1965,
    "creator": "Committee",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "Highly specialized Elite version of ALGOL, enhanced for modern Research architecture.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152_v2_164",
    "name": "Perl Pro Legacy Elite v2",
    "year": 2006,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized v2 version of Perl Pro Legacy Elite, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "solidity_z_96_industrial_112_z_126_next_165",
    "name": "Solidity Z Industrial Z Next",
    "year": 2026,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Next version of Solidity Z Industrial Z, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "logo_z_166",
    "name": "Logo Z",
    "year": 1969,
    "creator": "Wally Feurzeig",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Basic",
    "color": "#FF7600",
    "description": "Highly specialized Z version of Logo, enhanced for modern Academic architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "lua_x_167",
    "name": "Lua X",
    "year": 1998,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized X version of Lua, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "nim_elite_168",
    "name": "Nim Elite",
    "year": 2016,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Elite version of Nim, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "r_ii_104_z_142_alpha_169",
    "name": "R II Z Alpha",
    "year": 2010,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Alpha version of R II Z, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "haskell_pro_55_x_170",
    "name": "Haskell Pro X",
    "year": 1996,
    "creator": "Committee",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#5E5086",
    "description": "Highly specialized X version of Haskell Pro, enhanced for modern Scientific architecture.",
    "parent": [
      "Miranda"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "modula_2_industrial_171",
    "name": "Modula-2 Industrial",
    "year": 1985,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized Industrial version of Modula-2, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97_alpha_130_z_172",
    "name": "Clojure X Alpha Z",
    "year": 2020,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Z version of Clojure X Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "sql_x_173",
    "name": "SQL X",
    "year": 1974,
    "creator": "IBM",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#4479A1",
    "description": "Highly specialized X version of SQL, enhanced for modern Data architecture.",
    "parent": [
      "Datalog"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "c__x_60_legacy_69_elite_149_v2_174",
    "name": "C# X Legacy Elite v2",
    "year": 2014,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized v2 version of C# X Legacy Elite, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "php_x_175",
    "name": "PHP X",
    "year": 2000,
    "creator": "Rasmus Lerdorf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Web"
    ],
    "difficulty": "Basic",
    "color": "#4F5D95",
    "description": "Highly specialized X version of PHP, enhanced for modern Web architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97_pro_176",
    "name": "Clojure X Pro",
    "year": 2012,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Pro version of Clojure X, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "fortran_industrial_177",
    "name": "Fortran Industrial",
    "year": 1958,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Industrial version of Fortran, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_prime_118_industrial_178",
    "name": "Fortran Next Prime Industrial",
    "year": 1975,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Industrial version of Fortran Next Prime, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "r_ii_104_legacy_116_next_179",
    "name": "R II Legacy Next",
    "year": 2009,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized Next version of R II Legacy, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "ada_ii_180",
    "name": "Ada II",
    "year": 1989,
    "creator": "Jean Ichbiah",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#02F882",
    "description": "Highly specialized II version of Ada, enhanced for modern Embedded architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_ii_92_elite_181",
    "name": "Nim Industrial II Elite",
    "year": 2024,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Elite version of Nim Industrial II, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97_pro_176_z_182",
    "name": "Clojure X Pro Z",
    "year": 2012,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Z version of Clojure X Pro, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "julia_industrial_72_next_183",
    "name": "Julia Industrial Next",
    "year": 2014,
    "creator": "Viral Shah",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#9558B2",
    "description": "Highly specialized Next version of Julia Industrial, enhanced for modern Scientific architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_x_184",
    "name": "Java Industrial X",
    "year": 1999,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized X version of Java Industrial, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "f__elite_84_elite_185",
    "name": "F# Elite Elite",
    "year": 2015,
    "creator": "Don Syme",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#30B9DB",
    "description": "Highly specialized Elite version of F# Elite, enhanced for modern Enterprise architecture.",
    "parent": [
      "OCaml"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "assembly_prime_109_industrial_186",
    "name": "Assembly Prime Industrial",
    "year": 1957,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Industrial version of Assembly Prime, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "modula_2_v2_139_z_187",
    "name": "Modula-2 v2 Z",
    "year": 1986,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized Z version of Modula-2 v2, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73_z_188",
    "name": "Fortran II Z",
    "year": 1970,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Z version of Fortran II, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c__x_60_legacy_69_elite_149_v2_174_z_189",
    "name": "C# X Legacy Elite v2 Z",
    "year": 2014,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized Z version of C# X Legacy Elite v2, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "malbolge_z_190",
    "name": "Malbolge Z",
    "year": 2007,
    "creator": "Ben Olmstead",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Z version of Malbolge, enhanced for modern Challenge architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "prolog_next_191",
    "name": "Prolog Next",
    "year": 1979,
    "creator": "Colmerauer",
    "paradigms": [
      "Logic"
    ],
    "usage": [
      "AI"
    ],
    "difficulty": "Advanced",
    "color": "#74283C",
    "description": "Highly specialized Next version of Prolog, enhanced for modern AI architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "php_x_175_alpha_192",
    "name": "PHP X Alpha",
    "year": 2006,
    "creator": "Rasmus Lerdorf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Web"
    ],
    "difficulty": "Basic",
    "color": "#4F5D95",
    "description": "Highly specialized Alpha version of PHP X, enhanced for modern Web architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "dart_elite_193",
    "name": "Dart Elite",
    "year": 2015,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Highly specialized Elite version of Dart, enhanced for modern Mobile architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94_alpha_194",
    "name": "Fortran Next Legacy Alpha",
    "year": 1975,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Alpha version of Fortran Next Legacy, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "brainfuck_pro_68_v2_82_pro_195",
    "name": "Brainfuck Pro v2 Pro",
    "year": 2010,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Pro version of Brainfuck Pro v2, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c__alpha_132_ii_196",
    "name": "C# Alpha II",
    "year": 2013,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized II version of C# Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152_elite_197",
    "name": "Perl Pro Legacy Elite Elite",
    "year": 2001,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Elite version of Perl Pro Legacy Elite, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73_z_119_prime_198",
    "name": "Fortran II Z Prime",
    "year": 1967,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Prime version of Fortran II Z, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152_elite_197_industrial_199",
    "name": "Perl Pro Legacy Elite Elite Industrial",
    "year": 2008,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Industrial version of Perl Pro Legacy Elite Elite, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_200",
    "name": "Assembly Next X",
    "year": 1954,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized X version of Assembly Next, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "visual_basic_x_201",
    "name": "Visual Basic X",
    "year": 1997,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Basic",
    "color": "#003399",
    "description": "Highly specialized X version of Visual Basic, enhanced for modern Enterprise architecture.",
    "parent": [
      "BASIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "chef_v2_202",
    "name": "Chef v2",
    "year": 2006,
    "creator": "David Morgan-Mar",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#CD7F32",
    "description": "Highly specialized v2 version of Chef, enhanced for modern Challenge architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "dart_elite_193_legacy_203",
    "name": "Dart Elite Legacy",
    "year": 2018,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Highly specialized Legacy version of Dart Elite, enhanced for modern Mobile architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "ada_alpha_204",
    "name": "Ada Alpha",
    "year": 1985,
    "creator": "Jean Ichbiah",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#02F882",
    "description": "Highly specialized Alpha version of Ada, enhanced for modern Embedded architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "ada_alpha_205",
    "name": "Ada Alpha",
    "year": 1984,
    "creator": "Jean Ichbiah",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#02F882",
    "description": "Highly specialized Alpha version of Ada, enhanced for modern Embedded architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "cobol_elite_57_x_206",
    "name": "COBOL Elite X",
    "year": 1968,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized X version of COBOL Elite, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "ocaml_z_207",
    "name": "OCaml Z",
    "year": 1999,
    "creator": "INRIA",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#EB8B12",
    "description": "Highly specialized Z version of OCaml, enhanced for modern Scientific architecture.",
    "parent": [
      "ML"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_next_208",
    "name": "Forth X Next",
    "year": 1983,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized Next version of Forth X, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "r_ii_48_alpha_100_ii_209",
    "name": "R II Alpha II",
    "year": 2000,
    "creator": "Ross Ihaka",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Basic",
    "color": "#276BBE",
    "description": "Highly specialized II version of R II Alpha, enhanced for modern Data architecture.",
    "parent": [
      "S"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_59_prime_85_alpha_128_x_210",
    "name": "COBOL v2 Prime Alpha X",
    "year": 1971,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized X version of COBOL v2 Prime Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94_v2_211",
    "name": "Fortran Next Legacy v2",
    "year": 1971,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized v2 version of Fortran Next Legacy, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94_pro_212",
    "name": "Fortran Next Legacy Pro",
    "year": 1973,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Pro version of Fortran Next Legacy, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_x_213",
    "name": "Perl Pro Legacy X",
    "year": 1998,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized X version of Perl Pro Legacy, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "c__x_60_legacy_69_elite_149_v2_174_z_189_ii_214",
    "name": "C# X Legacy Elite v2 Z II",
    "year": 2023,
    "creator": "Microsoft",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#239120",
    "description": "Highly specialized II version of C# X Legacy Elite v2 Z, enhanced for modern Enterprise architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "pascal_alpha_141_z_215",
    "name": "Pascal Alpha Z",
    "year": 1977,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Basic",
    "color": "#E3F171",
    "description": "Highly specialized Z version of Pascal Alpha, enhanced for modern Academic architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "smalltalk_pro_86_pro_137_legacy_216",
    "name": "Smalltalk Pro Pro Legacy",
    "year": 1987,
    "creator": "Alan Kay",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#A2190E",
    "description": "Highly specialized Legacy version of Smalltalk Pro Pro, enhanced for modern Research architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scheme_pro_50_next_217",
    "name": "Scheme Pro Next",
    "year": 1978,
    "creator": "Guy Steele",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Advanced",
    "color": "#1E4BBD",
    "description": "Highly specialized Next version of Scheme Pro, enhanced for modern Academic architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_next_208_elite_218",
    "name": "Forth X Next Elite",
    "year": 1986,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized Elite version of Forth X Next, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "dart_elite_70_prime_129_z_219",
    "name": "Dart Elite Prime Z",
    "year": 2027,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Highly specialized Z version of Dart Elite Prime, enhanced for modern Mobile architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "forth_x_44_next_208_elite_218_pro_220",
    "name": "Forth X Next Elite Pro",
    "year": 1987,
    "creator": "Charles Moore",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#A04A15",
    "description": "Highly specialized Pro version of Forth X Next Elite, enhanced for modern Embedded architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "dart_elite_70_prime_129_z_219_legacy_221",
    "name": "Dart Elite Prime Z Legacy",
    "year": 2034,
    "creator": "Google",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Basic",
    "color": "#0175C2",
    "description": "Highly specialized Legacy version of Dart Elite Prime Z, enhanced for modern Mobile architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "f__industrial_222",
    "name": "F# Industrial",
    "year": 2011,
    "creator": "Don Syme",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#30B9DB",
    "description": "Highly specialized Industrial version of F#, enhanced for modern Enterprise architecture.",
    "parent": [
      "OCaml"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "lisp_elite_87_industrial_223",
    "name": "LISP Elite Industrial",
    "year": 1961,
    "creator": "John McCarthy",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "AI"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "Highly specialized Industrial version of LISP Elite, enhanced for modern AI architecture.",
    "parent": [
      "IPL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "modula_2_z_63_pro_224",
    "name": "Modula-2 Z Pro",
    "year": 1995,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized Pro version of Modula-2 Z, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_83_z_225",
    "name": "COBOL v2 Z",
    "year": 1972,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized Z version of COBOL v2, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "solidity_z_96_industrial_112_industrial_226",
    "name": "Solidity Z Industrial Industrial",
    "year": 2025,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Industrial version of Solidity Z Industrial, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "solidity_z_96_industrial_112_prime_227",
    "name": "Solidity Z Industrial Prime",
    "year": 2021,
    "creator": "Gavin Wood",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Blockchain"
    ],
    "difficulty": "Advanced",
    "color": "#363636",
    "description": "Highly specialized Prime version of Solidity Z Industrial, enhanced for modern Blockchain architecture.",
    "parent": [
      "JS"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_industrial_177_elite_228",
    "name": "Fortran Industrial Elite",
    "year": 1963,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Elite version of Fortran Industrial, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "cobol_v2_59_prime_85_x_114_x_229",
    "name": "COBOL v2 Prime X X",
    "year": 1965,
    "creator": "Grace Hopper",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#005C92",
    "description": "Highly specialized X version of COBOL v2 Prime X, enhanced for modern Enterprise architecture.",
    "parent": [
      "FLOW-MATIC"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97_alpha_130_elite_230",
    "name": "Clojure X Alpha Elite",
    "year": 2025,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Elite version of Clojure X Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_z_120_alpha_231",
    "name": "Nim Industrial Z Alpha",
    "year": 2023,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Alpha version of Nim Industrial Z, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94_alpha_232",
    "name": "Fortran Next Legacy Alpha",
    "year": 1970,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Alpha version of Fortran Next Legacy, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "brainfuck_pro_68_v2_82_pro_195_next_233",
    "name": "Brainfuck Pro v2 Pro Next",
    "year": 2011,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Next version of Brainfuck Pro v2 Pro, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "clojure_x_97_pro_176_elite_234",
    "name": "Clojure X Pro Elite",
    "year": 2012,
    "creator": "Rich Hickey",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Advanced",
    "color": "#5881D8",
    "description": "Highly specialized Elite version of Clojure X Pro, enhanced for modern Enterprise architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "julia_industrial_72_legacy_235",
    "name": "Julia Industrial Legacy",
    "year": 2023,
    "creator": "Viral Shah",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#9558B2",
    "description": "Highly specialized Legacy version of Julia Industrial, enhanced for modern Scientific architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_legacy_94_pro_212_pro_236",
    "name": "Fortran Next Legacy Pro Pro",
    "year": 1973,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Pro version of Fortran Next Legacy Pro, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_x_153_legacy_237",
    "name": "Perl Pro X Legacy",
    "year": 2004,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Legacy version of Perl Pro X, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "nim_industrial_51_ii_92_next_238",
    "name": "Nim Industrial II Next",
    "year": 2023,
    "creator": "Andreas Rumpf",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Systems"
    ],
    "difficulty": "Intermediate",
    "color": "#FFE953",
    "description": "Highly specialized Next version of Nim Industrial II, enhanced for modern Systems architecture.",
    "parent": [
      "Python"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_200_alpha_239",
    "name": "Assembly Next X Alpha",
    "year": 1957,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Alpha version of Assembly Next X, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "fortran_next_54_next_71_legacy_99_prime_240",
    "name": "Fortran Next Next Legacy Prime",
    "year": 1978,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Prime version of Fortran Next Next Legacy, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "smalltalk_pro_86_legacy_241",
    "name": "Smalltalk Pro Legacy",
    "year": 1979,
    "creator": "Alan Kay",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#A2190E",
    "description": "Highly specialized Legacy version of Smalltalk Pro, enhanced for modern Research architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_industrial_177_elite_228_alpha_242",
    "name": "Fortran Industrial Elite Alpha",
    "year": 1963,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Alpha version of Fortran Industrial Elite, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "objective_c_z_66_legacy_243",
    "name": "Objective-C Z Legacy",
    "year": 1990,
    "creator": "Brad Cox",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Mobile"
    ],
    "difficulty": "Advanced",
    "color": "#438EFF",
    "description": "Highly specialized Legacy version of Objective-C Z, enhanced for modern Mobile architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73_prime_110_alpha_244",
    "name": "Fortran II Prime Alpha",
    "year": 1977,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Alpha version of Fortran II Prime, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152_v2_164_next_245",
    "name": "Perl Pro Legacy Elite v2 Next",
    "year": 2015,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Next version of Perl Pro Legacy Elite v2, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lua_legacy_108_pro_246",
    "name": "Lua Legacy Pro",
    "year": 2001,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized Pro version of Lua Legacy, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "fortran_ii_73_z_119_prime_198_alpha_247",
    "name": "Fortran II Z Prime Alpha",
    "year": 1972,
    "creator": "IBM",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Advanced",
    "color": "#4D41B1",
    "description": "Highly specialized Alpha version of Fortran II Z Prime, enhanced for modern Scientific architecture.",
    "parent": [
      "ALGOL"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "php_x_175_legacy_248",
    "name": "PHP X Legacy",
    "year": 2004,
    "creator": "Rasmus Lerdorf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Web"
    ],
    "difficulty": "Basic",
    "color": "#4F5D95",
    "description": "Highly specialized Legacy version of PHP X, enhanced for modern Web architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "php_x_175_next_249",
    "name": "PHP X Next",
    "year": 2008,
    "creator": "Rasmus Lerdorf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Web"
    ],
    "difficulty": "Basic",
    "color": "#4F5D95",
    "description": "Highly specialized Next version of PHP X, enhanced for modern Web architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "apl_industrial_121_industrial_250",
    "name": "APL Industrial Industrial",
    "year": 1974,
    "creator": "Kenneth Iverson",
    "paradigms": [
      "Data"
    ],
    "usage": [
      "Scientific"
    ],
    "difficulty": "Expert",
    "color": "#8A1703",
    "description": "Highly specialized Industrial version of APL Industrial, enhanced for modern Scientific architecture.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Vectors",
          "Matrix Operations",
          "Syntax"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Data Wrangling",
          "Statistical Distributions",
          "Big Data Handling"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Distributed Computing",
          "Complex Aggregations",
          "Machine Learning Integration"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Real-time Analytics Dashboard",
          "Financial Prediction Engine"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_alpha_76_alpha_81_prime_251",
    "name": "Java Industrial Alpha Alpha Prime",
    "year": 2011,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Prime version of Java Industrial Alpha Alpha, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_ii_252",
    "name": "Assembly Next II",
    "year": 1953,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized II version of Assembly Next, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "modula_2_v2_139_next_253",
    "name": "Modula-2 v2 Next",
    "year": 1989,
    "creator": "Niklaus Wirth",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Advanced",
    "color": "#444444",
    "description": "Highly specialized Next version of Modula-2 v2, enhanced for modern Embedded architecture.",
    "parent": [
      "Pascal"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "tcl_industrial_107_prime_254",
    "name": "Tcl Industrial Prime",
    "year": 2001,
    "creator": "John Ousterhout",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Basic",
    "color": "#236FC4",
    "description": "Highly specialized Prime version of Tcl Industrial, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "lua_legacy_108_ii_255",
    "name": "Lua Legacy II",
    "year": 2001,
    "creator": "Tecgraf",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Gaming"
    ],
    "difficulty": "Basic",
    "color": "#000080",
    "description": "Highly specialized II version of Lua Legacy, enhanced for modern Gaming architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "brainfuck_pro_256",
    "name": "Brainfuck Pro",
    "year": 1998,
    "creator": "Urban Müller",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Pro version of Brainfuck, enhanced for modern Challenge architecture.",
    "parent": [
      "P"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scala_alpha_257",
    "name": "Scala Alpha",
    "year": 2008,
    "creator": "Martin Odersky",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Data"
    ],
    "difficulty": "Advanced",
    "color": "#DE3423",
    "description": "Highly specialized Alpha version of Scala, enhanced for modern Data architecture.",
    "parent": [
      "Java"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  },
  {
    "id": "malbolge_alpha_258",
    "name": "Malbolge Alpha",
    "year": 2004,
    "creator": "Ben Olmstead",
    "paradigms": [
      "Esoteric"
    ],
    "usage": [
      "Challenge"
    ],
    "difficulty": "Expert",
    "color": "#FFFFFF",
    "description": "Highly specialized Alpha version of Malbolge, enhanced for modern Challenge architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "java_industrial_65_next_259",
    "name": "Java Industrial Next",
    "year": 1999,
    "creator": "James Gosling",
    "paradigms": [
      "OOP"
    ],
    "usage": [
      "Enterprise"
    ],
    "difficulty": "Intermediate",
    "color": "#ED8B00",
    "description": "Highly specialized Next version of Java Industrial, enhanced for modern Enterprise architecture.",
    "parent": [
      "C++"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "assembly_next_45_x_74_pro_260",
    "name": "Assembly Next X Pro",
    "year": 1963,
    "creator": "Various",
    "paradigms": [
      "Systems"
    ],
    "usage": [
      "Embedded"
    ],
    "difficulty": "Expert",
    "color": "#6E4C13",
    "description": "Highly specialized Pro version of Assembly Next X, enhanced for modern Embedded architecture.",
    "parent": [
      "Binary"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax",
          "Hardware Interaction",
          "Binary & Hex"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Pointers",
          "Registers",
          "Interrupts"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Memory Management",
          "Inline Assembly",
          "DMA"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Build a Bootloader",
          "High-Performance Data Storage"
        ]
      }
    }
  },
  {
    "id": "algol_v2_261",
    "name": "ALGOL v2",
    "year": 1961,
    "creator": "Committee",
    "paradigms": [
      "Procedural"
    ],
    "usage": [
      "Research"
    ],
    "difficulty": "Advanced",
    "color": "#FFFFFF",
    "description": "Highly specialized v2 version of ALGOL, enhanced for modern Research architecture.",
    "parent": [
      "Math"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152_v2_164_v2_262",
    "name": "Perl Pro Legacy Elite v2 v2",
    "year": 2012,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized v2 version of Perl Pro Legacy Elite v2, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "perl_pro_52_legacy_113_elite_152_elite_197_industrial_199_legacy_263",
    "name": "Perl Pro Legacy Elite Elite Industrial Legacy",
    "year": 2012,
    "creator": "Larry Wall",
    "paradigms": [
      "Scripting"
    ],
    "usage": [
      "Automation"
    ],
    "difficulty": "Intermediate",
    "color": "#39457E",
    "description": "Highly specialized Legacy version of Perl Pro Legacy Elite Elite Industrial, enhanced for modern Automation architecture.",
    "parent": [
      "C"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Syntax Basics",
          "Data Types",
          "Operators"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Control Structures",
          "Loops",
          "Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Intermediate APIs",
          "Data Structures",
          "Recursion"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Production-Ready Application",
          "Integration with Backend"
        ]
      }
    }
  },
  {
    "id": "scheme_pro_50_x_264",
    "name": "Scheme Pro X",
    "year": 1982,
    "creator": "Guy Steele",
    "paradigms": [
      "Functional"
    ],
    "usage": [
      "Academic"
    ],
    "difficulty": "Advanced",
    "color": "#1E4BBD",
    "description": "Highly specialized X version of Scheme Pro, enhanced for modern Academic architecture.",
    "parent": [
      "LISP"
    ],
    "tier": {
      "1": {
        "title": "FOUNDATION",
        "topics": [
          "Pure Functions",
          "Immutability",
          "Recursion"
        ]
      },
      "2": {
        "title": "LOGIC",
        "topics": [
          "Monads",
          "Currying",
          "Higher-Order Functions"
        ]
      },
      "3": {
        "title": "ADVANCED",
        "topics": [
          "Category Theory",
          "Functors",
          "Lazy Evaluation"
        ]
      },
      "4": {
        "title": "REAL-WORLD",
        "topics": [
          "Formally Verified Logic Engine",
          "Concurrent Pricing Service"
        ]
      }
    }
  }
];

export const PARADIGMS = [
  "Procedural", "OOP", "Functional", "Logic", "Systems", "Scripting", 
  "Concurrent", "Contract-oriented", "Static Typing", "Meta-programming",
  "Parallel", "Statistical", "Imperative", "Multi", "Esoteric"
];

export const USAGES = [
  "Web", "Systems", "AI", "Mobile", "Data Science", "Enterprise", 
  "Gaming", "Embedded", "Blockchain", "Fintech", "Scientific", "Automation", "Academic", "Research", "Challenge", "Hardware", "Printing", "Mainframe"
];

export const DIFFICULTIES = ["Basic", "Intermediate", "Advanced", "Expert"];
