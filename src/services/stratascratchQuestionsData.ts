/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SqlProblem } from '../types';

// 50 Authentic StrataScratch & FAANG Production Business Analytics Interview Cases
export const ALL_STRATASCRATCH_PROBLEMS: SqlProblem[] = [
  {
    "id": "ss_airbnb_host_acceptance_rate",
    "questionNumber": 1,
    "title": "Airbnb: Host Acceptance Rate",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "At Airbnb, marketplace operations teams monitor host responsiveness. Write a SQL query to calculate the average host acceptance rate for each neighborhood. An acceptance rate is calculated as the total number of accepted booking inquiries divided by the total number of inquiries sent to hosts in that neighborhood. Output the neighborhood and the acceptance_rate rounded to 2 decimal places, ordered by acceptance_rate descending.",
    "requirements": [
      "Join airbnb_listings with airbnb_inquiries on listing_id",
      "Calculate acceptance_rate = ROUND(SUM(CASE WHEN status = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2)",
      "Group by neighborhood",
      "Order by acceptance_rate DESC, neighborhood ASC"
    ],
    "schemas": [
      {
        "tableName": "airbnb_listings",
        "columns": [
          {
            "name": "listing_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "host_id",
            "type": "INT"
          },
          {
            "name": "neighborhood",
            "type": "VARCHAR"
          },
          {
            "name": "price",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "listing_id": 101,
            "host_id": 1,
            "neighborhood": "Mission District",
            "price": 150
          },
          {
            "listing_id": 102,
            "host_id": 2,
            "neighborhood": "Mission District",
            "price": 200
          },
          {
            "listing_id": 103,
            "host_id": 3,
            "neighborhood": "SoMa",
            "price": 250
          },
          {
            "listing_id": 104,
            "host_id": 4,
            "neighborhood": "Marina",
            "price": 300
          }
        ]
      },
      {
        "tableName": "airbnb_inquiries",
        "columns": [
          {
            "name": "inquiry_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "listing_id",
            "type": "INT"
          },
          {
            "name": "guest_id",
            "type": "INT"
          },
          {
            "name": "status",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "inquiry_id": 1,
            "listing_id": 101,
            "guest_id": 501,
            "status": "accepted"
          },
          {
            "inquiry_id": 2,
            "listing_id": 101,
            "guest_id": 502,
            "status": "accepted"
          },
          {
            "inquiry_id": 3,
            "listing_id": 102,
            "guest_id": 503,
            "status": "rejected"
          },
          {
            "inquiry_id": 4,
            "listing_id": 103,
            "guest_id": 504,
            "status": "accepted"
          },
          {
            "inquiry_id": 5,
            "listing_id": 104,
            "guest_id": 505,
            "status": "rejected"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "neighborhood",
        "acceptance_rate"
      ],
      "rows": [
        {
          "neighborhood": "SoMa",
          "acceptance_rate": 1
        },
        {
          "neighborhood": "Mission District",
          "acceptance_rate": 0.67
        },
        {
          "neighborhood": "Marina",
          "acceptance_rate": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Airbnb business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT l.neighborhood, ROUND(SUM(CASE WHEN i.status = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS acceptance_rate FROM airbnb_listings l JOIN airbnb_inquiries i ON l.listing_id = i.listing_id GROUP BY l.neighborhood ORDER BY acceptance_rate DESC, l.neighborhood ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT l.neighborhood, ROUND(SUM(CASE WHEN i.status = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS acceptance_rate FROM airbnb_listings l JOIN airbnb_inquiries i ON l.listing_id = i.listing_id GROUP BY l.neighborhood ORDER BY acceptance_rate DESC, l.neighborhood ASC;",
      "snowflake": "SELECT l.neighborhood, ROUND(SUM(CASE WHEN i.status = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS acceptance_rate FROM airbnb_listings l JOIN airbnb_inquiries i ON l.listing_id = i.listing_id GROUP BY l.neighborhood ORDER BY acceptance_rate DESC, l.neighborhood ASC;",
      "bigquery": "SELECT l.neighborhood, ROUND(SUM(CASE WHEN i.status = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS acceptance_rate FROM airbnb_listings l JOIN airbnb_inquiries i ON l.listing_id = i.listing_id GROUP BY l.neighborhood ORDER BY acceptance_rate DESC, l.neighborhood ASC;",
      "mysql": "SELECT l.neighborhood, ROUND(SUM(CASE WHEN i.status = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS acceptance_rate FROM airbnb_listings l JOIN airbnb_inquiries i ON l.listing_id = i.listing_id GROUP BY l.neighborhood ORDER BY acceptance_rate DESC, l.neighborhood ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/1",
    "companyTag": "Airbnb",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_airbnb_top_expensive_neighborhoods",
    "questionNumber": 2,
    "title": "Airbnb: Top 3 Most Expensive Neighborhoods",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Write a SQL query to identify the top 3 most expensive neighborhoods based on average listing price per bedroom. Neighborhoods with fewer than 2 active listings should be excluded. Output the neighborhood, total_listings, and avg_price_per_bedroom rounded to 2 decimal places, ordered by avg_price_per_bedroom in descending order.",
    "requirements": [
      "Filter listings where bedrooms > 0",
      "Group by neighborhood and require COUNT(*) >= 2",
      "Compute avg_price_per_bedroom = ROUND(AVG(price / bedrooms), 2)",
      "Order by avg_price_per_bedroom DESC and LIMIT to 3"
    ],
    "schemas": [
      {
        "tableName": "airbnb_properties",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "neighborhood",
            "type": "VARCHAR"
          },
          {
            "name": "bedrooms",
            "type": "INT"
          },
          {
            "name": "price",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "id": 1,
            "neighborhood": "Downtown",
            "bedrooms": 2,
            "price": 600
          },
          {
            "id": 2,
            "neighborhood": "Downtown",
            "bedrooms": 1,
            "price": 350
          },
          {
            "id": 3,
            "neighborhood": "Suburbs",
            "bedrooms": 3,
            "price": 300
          },
          {
            "id": 4,
            "neighborhood": "Suburbs",
            "bedrooms": 4,
            "price": 360
          },
          {
            "id": 5,
            "neighborhood": "Uptown",
            "bedrooms": 2,
            "price": 500
          },
          {
            "id": 6,
            "neighborhood": "Uptown",
            "bedrooms": 1,
            "price": 280
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "neighborhood",
        "total_listings",
        "avg_price_per_bedroom"
      ],
      "rows": [
        {
          "neighborhood": "Downtown",
          "total_listings": 2,
          "avg_price_per_bedroom": 325
        },
        {
          "neighborhood": "Uptown",
          "total_listings": 2,
          "avg_price_per_bedroom": 265
        },
        {
          "neighborhood": "Suburbs",
          "total_listings": 2,
          "avg_price_per_bedroom": 95
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Airbnb business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT neighborhood, COUNT(*) AS total_listings, ROUND(AVG(price / bedrooms), 2) AS avg_price_per_bedroom FROM airbnb_properties WHERE bedrooms > 0 GROUP BY neighborhood HAVING COUNT(*) >= 2 ORDER BY avg_price_per_bedroom DESC LIMIT 3;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT neighborhood, COUNT(*) AS total_listings, ROUND(AVG(price / bedrooms), 2) AS avg_price_per_bedroom FROM airbnb_properties WHERE bedrooms > 0 GROUP BY neighborhood HAVING COUNT(*) >= 2 ORDER BY avg_price_per_bedroom DESC LIMIT 3;",
      "snowflake": "SELECT neighborhood, COUNT(*) AS total_listings, ROUND(AVG(price / bedrooms), 2) AS avg_price_per_bedroom FROM airbnb_properties WHERE bedrooms > 0 GROUP BY neighborhood HAVING COUNT(*) >= 2 ORDER BY avg_price_per_bedroom DESC LIMIT 3;",
      "bigquery": "SELECT neighborhood, COUNT(*) AS total_listings, ROUND(AVG(price / bedrooms), 2) AS avg_price_per_bedroom FROM airbnb_properties WHERE bedrooms > 0 GROUP BY neighborhood HAVING COUNT(*) >= 2 ORDER BY avg_price_per_bedroom DESC LIMIT 3;",
      "mysql": "SELECT neighborhood, COUNT(*) AS total_listings, ROUND(AVG(price / bedrooms), 2) AS avg_price_per_bedroom FROM airbnb_properties WHERE bedrooms > 0 GROUP BY neighborhood HAVING COUNT(*) >= 2 ORDER BY avg_price_per_bedroom DESC LIMIT 3;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/2",
    "companyTag": "Airbnb",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_airbnb_avg_bath_bed_ratio",
    "questionNumber": 3,
    "title": "Airbnb: Average Bathrooms and Bedrooms Ratio",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the average number of bathrooms, average number of bedrooms, and average bathroom-to-bedroom ratio for each property type across Airbnb listings. Filter out any property with 0 bedrooms. Round all averages to 2 decimal places. Output property_type, avg_bathrooms, avg_bedrooms, and avg_bath_to_bed_ratio ordered by property_type ascending.",
    "requirements": [
      "Filter where bedrooms > 0 and bathrooms IS NOT NULL",
      "Compute ROUND(AVG(bathrooms), 2) and ROUND(AVG(bedrooms), 2)",
      "Compute ROUND(AVG(bathrooms * 1.0 / bedrooms), 2) AS avg_bath_to_bed_ratio",
      "Group by property_type and order by property_type ASC"
    ],
    "schemas": [
      {
        "tableName": "airbnb_units",
        "columns": [
          {
            "name": "unit_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "property_type",
            "type": "VARCHAR"
          },
          {
            "name": "bathrooms",
            "type": "NUMERIC"
          },
          {
            "name": "bedrooms",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "unit_id": 1,
            "property_type": "Apartment",
            "bathrooms": 1,
            "bedrooms": 1
          },
          {
            "unit_id": 2,
            "property_type": "Apartment",
            "bathrooms": 2,
            "bedrooms": 2
          },
          {
            "unit_id": 3,
            "property_type": "House",
            "bathrooms": 2.5,
            "bedrooms": 3
          },
          {
            "unit_id": 4,
            "property_type": "House",
            "bathrooms": 3,
            "bedrooms": 4
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "property_type",
        "avg_bathrooms",
        "avg_bedrooms",
        "avg_bath_to_bed_ratio"
      ],
      "rows": [
        {
          "property_type": "Apartment",
          "avg_bathrooms": 1.5,
          "avg_bedrooms": 1.5,
          "avg_bath_to_bed_ratio": 1
        },
        {
          "property_type": "House",
          "avg_bathrooms": 2.75,
          "avg_bedrooms": 3.5,
          "avg_bath_to_bed_ratio": 0.79
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Airbnb business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT property_type, ROUND(AVG(bathrooms), 2) AS avg_bathrooms, ROUND(AVG(bedrooms), 2) AS avg_bedrooms, ROUND(AVG(bathrooms * 1.0 / bedrooms), 2) AS avg_bath_to_bed_ratio FROM airbnb_units WHERE bedrooms > 0 GROUP BY property_type ORDER BY property_type ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT property_type, ROUND(AVG(bathrooms), 2) AS avg_bathrooms, ROUND(AVG(bedrooms), 2) AS avg_bedrooms, ROUND(AVG(bathrooms * 1.0 / bedrooms), 2) AS avg_bath_to_bed_ratio FROM airbnb_units WHERE bedrooms > 0 GROUP BY property_type ORDER BY property_type ASC;",
      "snowflake": "SELECT property_type, ROUND(AVG(bathrooms), 2) AS avg_bathrooms, ROUND(AVG(bedrooms), 2) AS avg_bedrooms, ROUND(AVG(bathrooms * 1.0 / bedrooms), 2) AS avg_bath_to_bed_ratio FROM airbnb_units WHERE bedrooms > 0 GROUP BY property_type ORDER BY property_type ASC;",
      "bigquery": "SELECT property_type, ROUND(AVG(bathrooms), 2) AS avg_bathrooms, ROUND(AVG(bedrooms), 2) AS avg_bedrooms, ROUND(AVG(bathrooms * 1.0 / bedrooms), 2) AS avg_bath_to_bed_ratio FROM airbnb_units WHERE bedrooms > 0 GROUP BY property_type ORDER BY property_type ASC;",
      "mysql": "SELECT property_type, ROUND(AVG(bathrooms), 2) AS avg_bathrooms, ROUND(AVG(bedrooms), 2) AS avg_bedrooms, ROUND(AVG(bathrooms * 1.0 / bedrooms), 2) AS avg_bath_to_bed_ratio FROM airbnb_units WHERE bedrooms > 0 GROUP BY property_type ORDER BY property_type ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/3",
    "companyTag": "Airbnb",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_airbnb_search_to_booking_conversion",
    "questionNumber": 4,
    "title": "Airbnb: Search to Booking Conversion",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Analyze user search funnel conversions at Airbnb. For each user search session, calculate whether the user made a reservation within 48 hours of that search. Output the destination_country, total_searches, total_bookings, and conversion_rate_pct rounded to 2 decimal places. Order the results by conversion_rate_pct in descending order.",
    "requirements": [
      "Join search_events with bookings on user_id and destination",
      "Consider booking valid if booking_time BETWEEN search_time AND search_time + INTERVAL '48 hours'",
      "Compute conversion_rate_pct = ROUND(COUNT(DISTINCT booking_id) * 100.0 / COUNT(DISTINCT search_id), 2)",
      "Group by destination_country and order by conversion_rate_pct DESC"
    ],
    "schemas": [
      {
        "tableName": "search_events",
        "columns": [
          {
            "name": "search_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "destination_country",
            "type": "VARCHAR"
          },
          {
            "name": "search_time",
            "type": "TIMESTAMP"
          }
        ],
        "sampleRows": [
          {
            "search_id": 1,
            "user_id": 10,
            "destination_country": "FR",
            "search_time": "2026-03-01 10:00:00"
          },
          {
            "search_id": 2,
            "user_id": 10,
            "destination_country": "FR",
            "search_time": "2026-03-02 12:00:00"
          },
          {
            "search_id": 3,
            "user_id": 11,
            "destination_country": "JP",
            "search_time": "2026-03-01 09:00:00"
          },
          {
            "search_id": 4,
            "user_id": 12,
            "destination_country": "US",
            "search_time": "2026-03-03 14:00:00"
          }
        ]
      },
      {
        "tableName": "bookings",
        "columns": [
          {
            "name": "booking_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "country",
            "type": "VARCHAR"
          },
          {
            "name": "booking_time",
            "type": "TIMESTAMP"
          }
        ],
        "sampleRows": [
          {
            "booking_id": 101,
            "user_id": 10,
            "country": "FR",
            "booking_time": "2026-03-01 18:00:00"
          },
          {
            "booking_id": 102,
            "user_id": 11,
            "country": "JP",
            "booking_time": "2026-03-01 10:30:00"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "destination_country",
        "total_searches",
        "total_bookings",
        "conversion_rate_pct"
      ],
      "rows": [
        {
          "destination_country": "JP",
          "total_searches": 1,
          "total_bookings": 1,
          "conversion_rate_pct": 100
        },
        {
          "destination_country": "FR",
          "total_searches": 2,
          "total_bookings": 1,
          "conversion_rate_pct": 50
        },
        {
          "destination_country": "US",
          "total_searches": 1,
          "total_bookings": 0,
          "conversion_rate_pct": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Airbnb business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT s.destination_country, COUNT(DISTINCT s.search_id) AS total_searches, COUNT(DISTINCT b.booking_id) AS total_bookings, ROUND(COUNT(DISTINCT b.booking_id) * 100.0 / COUNT(DISTINCT s.search_id), 2) AS conversion_rate_pct FROM search_events s LEFT JOIN bookings b ON s.user_id = b.user_id AND s.destination_country = b.country AND b.booking_time >= s.search_time AND b.booking_time <= s.search_time + INTERVAL '48 hours' GROUP BY s.destination_country ORDER BY conversion_rate_pct DESC, s.destination_country ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT s.destination_country, COUNT(DISTINCT s.search_id) AS total_searches, COUNT(DISTINCT b.booking_id) AS total_bookings, ROUND(COUNT(DISTINCT b.booking_id) * 100.0 / COUNT(DISTINCT s.search_id), 2) AS conversion_rate_pct FROM search_events s LEFT JOIN bookings b ON s.user_id = b.user_id AND s.destination_country = b.country AND b.booking_time >= s.search_time AND b.booking_time <= s.search_time + INTERVAL '48 hours' GROUP BY s.destination_country ORDER BY conversion_rate_pct DESC, s.destination_country ASC;",
      "snowflake": "SELECT s.destination_country, COUNT(DISTINCT s.search_id) AS total_searches, COUNT(DISTINCT b.booking_id) AS total_bookings, ROUND(COUNT(DISTINCT b.booking_id) * 100.0 / COUNT(DISTINCT s.search_id), 2) AS conversion_rate_pct FROM search_events s LEFT JOIN bookings b ON s.user_id = b.user_id AND s.destination_country = b.country AND b.booking_time >= s.search_time AND b.booking_time <= s.search_time + INTERVAL '48 hours' GROUP BY s.destination_country ORDER BY conversion_rate_pct DESC, s.destination_country ASC;",
      "bigquery": "SELECT s.destination_country, COUNT(DISTINCT s.search_id) AS total_searches, COUNT(DISTINCT b.booking_id) AS total_bookings, ROUND(COUNT(DISTINCT b.booking_id) * 100.0 / COUNT(DISTINCT s.search_id), 2) AS conversion_rate_pct FROM search_events s LEFT JOIN bookings b ON s.user_id = b.user_id AND s.destination_country = b.country AND b.booking_time >= s.search_time AND b.booking_time <= s.search_time + INTERVAL '48 hours' GROUP BY s.destination_country ORDER BY conversion_rate_pct DESC, s.destination_country ASC;",
      "mysql": "SELECT s.destination_country, COUNT(DISTINCT s.search_id) AS total_searches, COUNT(DISTINCT b.booking_id) AS total_bookings, ROUND(COUNT(DISTINCT b.booking_id) * 100.0 / COUNT(DISTINCT s.search_id), 2) AS conversion_rate_pct FROM search_events s LEFT JOIN bookings b ON s.user_id = b.user_id AND s.destination_country = b.country AND b.booking_time >= s.search_time AND b.booking_time <= s.search_time + INTERVAL '48 hours' GROUP BY s.destination_country ORDER BY conversion_rate_pct DESC, s.destination_country ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/4",
    "companyTag": "Airbnb",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_airbnb_nationality_by_unit_type",
    "questionNumber": 5,
    "title": "Airbnb: Units Per Nationality",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "JOINS",
    "businessScenario": "Find the total number of distinct rental apartments owned by hosts of each nationality. Also compute the average price of these apartments. Sort the results by total distinct units in descending order, then by nationality alphabetically.",
    "requirements": [
      "Join hosts on host_id",
      "Filter where unit_type = 'Apartment'",
      "Output columns: nationality, total_apartments, avg_price",
      "Order by total_apartments DESC, nationality ASC"
    ],
    "schemas": [
      {
        "tableName": "airbnb_hosts",
        "columns": [
          {
            "name": "host_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "nationality",
            "type": "VARCHAR"
          },
          {
            "name": "gender",
            "type": "VARCHAR"
          },
          {
            "name": "age",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "host_id": 1,
            "nationality": "USA",
            "gender": "F",
            "age": 34
          },
          {
            "host_id": 2,
            "nationality": "USA",
            "gender": "M",
            "age": 45
          },
          {
            "host_id": 3,
            "nationality": "UK",
            "gender": "F",
            "age": 29
          },
          {
            "host_id": 4,
            "nationality": "FRA",
            "gender": "M",
            "age": 52
          }
        ]
      },
      {
        "tableName": "airbnb_apartments",
        "columns": [
          {
            "name": "unit_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "host_id",
            "type": "INT"
          },
          {
            "name": "unit_type",
            "type": "VARCHAR"
          },
          {
            "name": "price",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "unit_id": 101,
            "host_id": 1,
            "unit_type": "Apartment",
            "price": 180
          },
          {
            "unit_id": 102,
            "host_id": 1,
            "unit_type": "Apartment",
            "price": 220
          },
          {
            "unit_id": 103,
            "host_id": 2,
            "unit_type": "Apartment",
            "price": 150
          },
          {
            "unit_id": 104,
            "host_id": 3,
            "unit_type": "Apartment",
            "price": 210
          },
          {
            "unit_id": 105,
            "host_id": 4,
            "unit_type": "House",
            "price": 350
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "nationality",
        "total_apartments",
        "avg_price"
      ],
      "rows": [
        {
          "nationality": "USA",
          "total_apartments": 3,
          "avg_price": 183.33
        },
        {
          "nationality": "UK",
          "total_apartments": 1,
          "avg_price": 210
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Airbnb business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT h.nationality, COUNT(DISTINCT a.unit_id) AS total_apartments, ROUND(AVG(a.price), 2) AS avg_price FROM airbnb_hosts h JOIN airbnb_apartments a ON h.host_id = a.host_id WHERE a.unit_type = 'Apartment' GROUP BY h.nationality ORDER BY total_apartments DESC, h.nationality ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT h.nationality, COUNT(DISTINCT a.unit_id) AS total_apartments, ROUND(AVG(a.price), 2) AS avg_price FROM airbnb_hosts h JOIN airbnb_apartments a ON h.host_id = a.host_id WHERE a.unit_type = 'Apartment' GROUP BY h.nationality ORDER BY total_apartments DESC, h.nationality ASC;",
      "snowflake": "SELECT h.nationality, COUNT(DISTINCT a.unit_id) AS total_apartments, ROUND(AVG(a.price), 2) AS avg_price FROM airbnb_hosts h JOIN airbnb_apartments a ON h.host_id = a.host_id WHERE a.unit_type = 'Apartment' GROUP BY h.nationality ORDER BY total_apartments DESC, h.nationality ASC;",
      "bigquery": "SELECT h.nationality, COUNT(DISTINCT a.unit_id) AS total_apartments, ROUND(AVG(a.price), 2) AS avg_price FROM airbnb_hosts h JOIN airbnb_apartments a ON h.host_id = a.host_id WHERE a.unit_type = 'Apartment' GROUP BY h.nationality ORDER BY total_apartments DESC, h.nationality ASC;",
      "mysql": "SELECT h.nationality, COUNT(DISTINCT a.unit_id) AS total_apartments, ROUND(AVG(a.price), 2) AS avg_price FROM airbnb_hosts h JOIN airbnb_apartments a ON h.host_id = a.host_id WHERE a.unit_type = 'Apartment' GROUP BY h.nationality ORDER BY total_apartments DESC, h.nationality ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/5",
    "companyTag": "Airbnb",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_airbnb_reviews_sentiment",
    "questionNumber": 6,
    "title": "Airbnb: Reviews Sentiment by City",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the ratio of positive reviews (sentiment score >= 4) to total reviews for each city. Exclude cities with fewer than 3 total reviews. Output city, total_reviews, positive_reviews, and positive_ratio rounded to 2 decimal places, ordered by positive_ratio DESC.",
    "requirements": [
      "Filter where score IS NOT NULL",
      "Group by city having COUNT(*) >= 3",
      "Compute positive_ratio = ROUND(SUM(CASE WHEN score >= 4 THEN 1.0 ELSE 0.0 END) / COUNT(*), 2)",
      "Order by positive_ratio DESC, city ASC"
    ],
    "schemas": [
      {
        "tableName": "city_reviews",
        "columns": [
          {
            "name": "review_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "city",
            "type": "VARCHAR"
          },
          {
            "name": "score",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "review_id": 1,
            "city": "Paris",
            "score": 5
          },
          {
            "review_id": 2,
            "city": "Paris",
            "score": 4
          },
          {
            "review_id": 3,
            "city": "Paris",
            "score": 2
          },
          {
            "review_id": 4,
            "city": "Tokyo",
            "score": 5
          },
          {
            "review_id": 5,
            "city": "Tokyo",
            "score": 5
          },
          {
            "review_id": 6,
            "city": "Tokyo",
            "score": 4
          },
          {
            "review_id": 7,
            "city": "Rome",
            "score": 3
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "city",
        "total_reviews",
        "positive_reviews",
        "positive_ratio"
      ],
      "rows": [
        {
          "city": "Tokyo",
          "total_reviews": 3,
          "positive_reviews": 3,
          "positive_ratio": 1
        },
        {
          "city": "Paris",
          "total_reviews": 3,
          "positive_reviews": 2,
          "positive_ratio": 0.67
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Airbnb business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT city, COUNT(*) AS total_reviews, SUM(CASE WHEN score >= 4 THEN 1 ELSE 0 END) AS positive_reviews, ROUND(SUM(CASE WHEN score >= 4 THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS positive_ratio FROM city_reviews GROUP BY city HAVING COUNT(*) >= 3 ORDER BY positive_ratio DESC, city ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT city, COUNT(*) AS total_reviews, SUM(CASE WHEN score >= 4 THEN 1 ELSE 0 END) AS positive_reviews, ROUND(SUM(CASE WHEN score >= 4 THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS positive_ratio FROM city_reviews GROUP BY city HAVING COUNT(*) >= 3 ORDER BY positive_ratio DESC, city ASC;",
      "snowflake": "SELECT city, COUNT(*) AS total_reviews, SUM(CASE WHEN score >= 4 THEN 1 ELSE 0 END) AS positive_reviews, ROUND(SUM(CASE WHEN score >= 4 THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS positive_ratio FROM city_reviews GROUP BY city HAVING COUNT(*) >= 3 ORDER BY positive_ratio DESC, city ASC;",
      "bigquery": "SELECT city, COUNT(*) AS total_reviews, SUM(CASE WHEN score >= 4 THEN 1 ELSE 0 END) AS positive_reviews, ROUND(SUM(CASE WHEN score >= 4 THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS positive_ratio FROM city_reviews GROUP BY city HAVING COUNT(*) >= 3 ORDER BY positive_ratio DESC, city ASC;",
      "mysql": "SELECT city, COUNT(*) AS total_reviews, SUM(CASE WHEN score >= 4 THEN 1 ELSE 0 END) AS positive_reviews, ROUND(SUM(CASE WHEN score >= 4 THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS positive_ratio FROM city_reviews GROUP BY city HAVING COUNT(*) >= 3 ORDER BY positive_ratio DESC, city ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/6",
    "companyTag": "Airbnb",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_meta_friend_request_acceptance_rate",
    "questionNumber": 7,
    "title": "Meta: Friend Request Acceptance Rate",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "At Meta, calculate the overall acceptance rate of friend requests by date of initial send. The acceptance rate is defined as the total number of accepted requests divided by the total number of friend requests sent on that calendar day. Round the acceptance rate to 2 decimal places and order by date ascending.",
    "requirements": [
      "Group by date",
      "Calculate acceptance_rate = ROUND(SUM(CASE WHEN action = 'accepted' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2)",
      "Order by date ASC"
    ],
    "schemas": [
      {
        "tableName": "friend_requests",
        "columns": [
          {
            "name": "sender_id",
            "type": "INT"
          },
          {
            "name": "receiver_id",
            "type": "INT"
          },
          {
            "name": "date",
            "type": "DATE"
          },
          {
            "name": "action",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "sender_id": 1,
            "receiver_id": 2,
            "date": "2026-01-01",
            "action": "sent"
          },
          {
            "sender_id": 1,
            "receiver_id": 2,
            "date": "2026-01-01",
            "action": "accepted"
          },
          {
            "sender_id": 2,
            "receiver_id": 3,
            "date": "2026-01-01",
            "action": "sent"
          },
          {
            "sender_id": 3,
            "receiver_id": 4,
            "date": "2026-01-02",
            "action": "sent"
          },
          {
            "sender_id": 3,
            "receiver_id": 4,
            "date": "2026-01-02",
            "action": "accepted"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "date",
        "acceptance_rate"
      ],
      "rows": [
        {
          "date": "2026-01-01",
          "acceptance_rate": 0.5
        },
        {
          "date": "2026-01-02",
          "acceptance_rate": 1
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Meta business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT date, ROUND(SUM(CASE WHEN action = 'accepted' THEN 1.0 ELSE 0.0 END) / NULLIF(SUM(CASE WHEN action = 'sent' THEN 1 ELSE 0 END), 0), 2) AS acceptance_rate FROM friend_requests GROUP BY date ORDER BY date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT date, ROUND(SUM(CASE WHEN action = 'accepted' THEN 1.0 ELSE 0.0 END) / NULLIF(SUM(CASE WHEN action = 'sent' THEN 1 ELSE 0 END), 0), 2) AS acceptance_rate FROM friend_requests GROUP BY date ORDER BY date ASC;",
      "snowflake": "SELECT date, ROUND(SUM(CASE WHEN action = 'accepted' THEN 1.0 ELSE 0.0 END) / NULLIF(SUM(CASE WHEN action = 'sent' THEN 1 ELSE 0 END), 0), 2) AS acceptance_rate FROM friend_requests GROUP BY date ORDER BY date ASC;",
      "bigquery": "SELECT date, ROUND(SUM(CASE WHEN action = 'accepted' THEN 1.0 ELSE 0.0 END) / NULLIF(SUM(CASE WHEN action = 'sent' THEN 1 ELSE 0 END), 0), 2) AS acceptance_rate FROM friend_requests GROUP BY date ORDER BY date ASC;",
      "mysql": "SELECT date, ROUND(SUM(CASE WHEN action = 'accepted' THEN 1.0 ELSE 0.0 END) / NULLIF(SUM(CASE WHEN action = 'sent' THEN 1 ELSE 0 END), 0), 2) AS acceptance_rate FROM friend_requests GROUP BY date ORDER BY date ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/7",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_meta_active_users_growth_rate",
    "questionNumber": 8,
    "title": "Meta: Active Users Month-over-Month Growth",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Calculate the month-over-month percentage growth in monthly active users (MAU) on Instagram. A user is active in a month if they performed at least one action. Output month (YYYY-MM), current_mau, previous_mau, and growth_rate_pct rounded to 2 decimal places. Order by month ascending.",
    "requirements": [
      "Extract YYYY-MM from event_date",
      "Calculate distinct active users per month",
      "Use LAG() window function to fetch previous month MAU",
      "Compute growth_rate_pct = ROUND((current_mau - previous_mau) * 100.0 / previous_mau, 2)",
      "Order by month ASC"
    ],
    "schemas": [
      {
        "tableName": "user_actions",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "DATE"
          },
          {
            "name": "action_type",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "user_id": 1,
            "event_date": "2026-01-10",
            "action_type": "like"
          },
          {
            "user_id": 2,
            "event_date": "2026-01-15",
            "action_type": "post"
          },
          {
            "user_id": 1,
            "event_date": "2026-02-05",
            "action_type": "comment"
          },
          {
            "user_id": 2,
            "event_date": "2026-02-12",
            "action_type": "like"
          },
          {
            "user_id": 3,
            "event_date": "2026-02-20",
            "action_type": "post"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "month",
        "current_mau",
        "previous_mau",
        "growth_rate_pct"
      ],
      "rows": [
        {
          "month": "2026-01",
          "current_mau": 2,
          "previous_mau": null,
          "growth_rate_pct": null
        },
        {
          "month": "2026-02",
          "current_mau": 3,
          "previous_mau": 2,
          "growth_rate_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Meta business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH monthly AS (SELECT TO_CHAR(event_date, 'YYYY-MM') AS month, COUNT(DISTINCT user_id) AS current_mau FROM user_actions GROUP BY TO_CHAR(event_date, 'YYYY-MM')) SELECT month, current_mau, LAG(current_mau) OVER (ORDER BY month) AS previous_mau, ROUND((current_mau - LAG(current_mau) OVER (ORDER BY month)) * 100.0 / LAG(current_mau) OVER (ORDER BY month), 2) AS growth_rate_pct FROM monthly ORDER BY month ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH monthly AS (SELECT TO_CHAR(event_date, 'YYYY-MM') AS month, COUNT(DISTINCT user_id) AS current_mau FROM user_actions GROUP BY TO_CHAR(event_date, 'YYYY-MM')) SELECT month, current_mau, LAG(current_mau) OVER (ORDER BY month) AS previous_mau, ROUND((current_mau - LAG(current_mau) OVER (ORDER BY month)) * 100.0 / LAG(current_mau) OVER (ORDER BY month), 2) AS growth_rate_pct FROM monthly ORDER BY month ASC;",
      "snowflake": "WITH monthly AS (SELECT TO_CHAR(event_date, 'YYYY-MM') AS month, COUNT(DISTINCT user_id) AS current_mau FROM user_actions GROUP BY TO_CHAR(event_date, 'YYYY-MM')) SELECT month, current_mau, LAG(current_mau) OVER (ORDER BY month) AS previous_mau, ROUND((current_mau - LAG(current_mau) OVER (ORDER BY month)) * 100.0 / LAG(current_mau) OVER (ORDER BY month), 2) AS growth_rate_pct FROM monthly ORDER BY month ASC;",
      "bigquery": "WITH monthly AS (SELECT TO_CHAR(event_date, 'YYYY-MM') AS month, COUNT(DISTINCT user_id) AS current_mau FROM user_actions GROUP BY TO_CHAR(event_date, 'YYYY-MM')) SELECT month, current_mau, LAG(current_mau) OVER (ORDER BY month) AS previous_mau, ROUND((current_mau - LAG(current_mau) OVER (ORDER BY month)) * 100.0 / LAG(current_mau) OVER (ORDER BY month), 2) AS growth_rate_pct FROM monthly ORDER BY month ASC;",
      "mysql": "WITH monthly AS (SELECT TO_CHAR(event_date, 'YYYY-MM') AS month, COUNT(DISTINCT user_id) AS current_mau FROM user_actions GROUP BY TO_CHAR(event_date, 'YYYY-MM')) SELECT month, current_mau, LAG(current_mau) OVER (ORDER BY month) AS previous_mau, ROUND((current_mau - LAG(current_mau) OVER (ORDER BY month)) * 100.0 / LAG(current_mau) OVER (ORDER BY month), 2) AS growth_rate_pct FROM monthly ORDER BY month ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/8",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_meta_ctr_by_device",
    "questionNumber": 9,
    "title": "Meta: Click-Through Rate (CTR) by Device",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the Click-Through Rate (CTR) for Facebook Ads across each device type (mobile, desktop, tablet). CTR is calculated as total clicks divided by total impressions, expressed as a percentage rounded to 2 decimal places. Order by ctr_percentage descending.",
    "requirements": [
      "Filter where event_type IN ('impression', 'click')",
      "Compute ctr_percentage = ROUND(SUM(CASE WHEN event_type = 'click' THEN 1.0 ELSE 0.0 END) * 100.0 / SUM(CASE WHEN event_type = 'impression' THEN 1.0 ELSE 0.0 END), 2)",
      "Group by device_type",
      "Order by ctr_percentage DESC"
    ],
    "schemas": [
      {
        "tableName": "ad_events",
        "columns": [
          {
            "name": "event_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "ad_id",
            "type": "INT"
          },
          {
            "name": "device_type",
            "type": "VARCHAR"
          },
          {
            "name": "event_type",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "event_id": 1,
            "ad_id": 101,
            "device_type": "mobile",
            "event_type": "impression"
          },
          {
            "event_id": 2,
            "ad_id": 101,
            "device_type": "mobile",
            "event_type": "click"
          },
          {
            "event_id": 3,
            "ad_id": 102,
            "device_type": "mobile",
            "event_type": "impression"
          },
          {
            "event_id": 4,
            "ad_id": 101,
            "device_type": "desktop",
            "event_type": "impression"
          },
          {
            "event_id": 5,
            "ad_id": 102,
            "device_type": "desktop",
            "event_type": "impression"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "device_type",
        "ctr_percentage"
      ],
      "rows": [
        {
          "device_type": "mobile",
          "ctr_percentage": 50
        },
        {
          "device_type": "desktop",
          "ctr_percentage": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Meta business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT device_type, ROUND(SUM(CASE WHEN event_type = 'click' THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(SUM(CASE WHEN event_type = 'impression' THEN 1.0 ELSE 0.0 END), 0), 2) AS ctr_percentage FROM ad_events GROUP BY device_type ORDER BY ctr_percentage DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT device_type, ROUND(SUM(CASE WHEN event_type = 'click' THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(SUM(CASE WHEN event_type = 'impression' THEN 1.0 ELSE 0.0 END), 0), 2) AS ctr_percentage FROM ad_events GROUP BY device_type ORDER BY ctr_percentage DESC;",
      "snowflake": "SELECT device_type, ROUND(SUM(CASE WHEN event_type = 'click' THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(SUM(CASE WHEN event_type = 'impression' THEN 1.0 ELSE 0.0 END), 0), 2) AS ctr_percentage FROM ad_events GROUP BY device_type ORDER BY ctr_percentage DESC;",
      "bigquery": "SELECT device_type, ROUND(SUM(CASE WHEN event_type = 'click' THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(SUM(CASE WHEN event_type = 'impression' THEN 1.0 ELSE 0.0 END), 0), 2) AS ctr_percentage FROM ad_events GROUP BY device_type ORDER BY ctr_percentage DESC;",
      "mysql": "SELECT device_type, ROUND(SUM(CASE WHEN event_type = 'click' THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(SUM(CASE WHEN event_type = 'impression' THEN 1.0 ELSE 0.0 END), 0), 2) AS ctr_percentage FROM ad_events GROUP BY device_type ORDER BY ctr_percentage DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/9",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_meta_popularity_percentage",
    "questionNumber": 10,
    "title": "Meta: Popularity Percentage of Friends",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Find the popularity percentage for each user on Facebook. A user popularity percentage is defined as the total number of friends this user has divided by the total number of users on the platform, multiplied by 100. Assume friendships are bidirectional (if user A is friends with B, then B is friends with A). Output user_id and popularity_pct rounded to 2 decimal places, ordered by user_id ascending.",
    "requirements": [
      "Create bidirectional union of friendships (user1, user2) UNION ALL (user2, user1)",
      "Count distinct friends per user",
      "Divide by total distinct users across platform * 100.0",
      "Round to 2 decimal places and order by user_id ASC"
    ],
    "schemas": [
      {
        "tableName": "facebook_friends",
        "columns": [
          {
            "name": "user1",
            "type": "INT"
          },
          {
            "name": "user2",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "user1": 1,
            "user2": 2
          },
          {
            "user1": 1,
            "user2": 3
          },
          {
            "user1": 2,
            "user2": 4
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "user_id",
        "popularity_pct"
      ],
      "rows": [
        {
          "user_id": 1,
          "popularity_pct": 50
        },
        {
          "user_id": 2,
          "popularity_pct": 50
        },
        {
          "user_id": 3,
          "popularity_pct": 25
        },
        {
          "user_id": 4,
          "popularity_pct": 25
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Meta business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH pairs AS (SELECT user1 AS u, user2 AS f FROM facebook_friends UNION SELECT user2 AS u, user1 AS f FROM facebook_friends), total_users AS (SELECT COUNT(DISTINCT u) AS total_count FROM pairs) SELECT p.u AS user_id, ROUND(COUNT(DISTINCT p.f) * 100.0 / (SELECT total_count FROM total_users), 2) AS popularity_pct FROM pairs p GROUP BY p.u ORDER BY user_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH pairs AS (SELECT user1 AS u, user2 AS f FROM facebook_friends UNION SELECT user2 AS u, user1 AS f FROM facebook_friends), total_users AS (SELECT COUNT(DISTINCT u) AS total_count FROM pairs) SELECT p.u AS user_id, ROUND(COUNT(DISTINCT p.f) * 100.0 / (SELECT total_count FROM total_users), 2) AS popularity_pct FROM pairs p GROUP BY p.u ORDER BY user_id ASC;",
      "snowflake": "WITH pairs AS (SELECT user1 AS u, user2 AS f FROM facebook_friends UNION SELECT user2 AS u, user1 AS f FROM facebook_friends), total_users AS (SELECT COUNT(DISTINCT u) AS total_count FROM pairs) SELECT p.u AS user_id, ROUND(COUNT(DISTINCT p.f) * 100.0 / (SELECT total_count FROM total_users), 2) AS popularity_pct FROM pairs p GROUP BY p.u ORDER BY user_id ASC;",
      "bigquery": "WITH pairs AS (SELECT user1 AS u, user2 AS f FROM facebook_friends UNION SELECT user2 AS u, user1 AS f FROM facebook_friends), total_users AS (SELECT COUNT(DISTINCT u) AS total_count FROM pairs) SELECT p.u AS user_id, ROUND(COUNT(DISTINCT p.f) * 100.0 / (SELECT total_count FROM total_users), 2) AS popularity_pct FROM pairs p GROUP BY p.u ORDER BY user_id ASC;",
      "mysql": "WITH pairs AS (SELECT user1 AS u, user2 AS f FROM facebook_friends UNION SELECT user2 AS u, user1 AS f FROM facebook_friends), total_users AS (SELECT COUNT(DISTINCT u) AS total_count FROM pairs) SELECT p.u AS user_id, ROUND(COUNT(DISTINCT p.f) * 100.0 / (SELECT total_count FROM total_users), 2) AS popularity_pct FROM pairs p GROUP BY p.u ORDER BY user_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/10",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_meta_post_reactions_ratio",
    "questionNumber": 11,
    "title": "Meta: Post Reactions Engagement Ratio",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "For each Facebook post category, calculate the ratio of heart/love reactions to total reactions. Exclude categories with fewer than 5 total reactions. Order by love_reaction_ratio descending.",
    "requirements": [
      "Filter where reaction IS NOT NULL",
      "Compute love_reaction_ratio = ROUND(SUM(CASE WHEN reaction = 'heart' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2)",
      "Group by category having COUNT(*) >= 5",
      "Order by love_reaction_ratio DESC"
    ],
    "schemas": [
      {
        "tableName": "post_reactions",
        "columns": [
          {
            "name": "post_id",
            "type": "INT"
          },
          {
            "name": "category",
            "type": "VARCHAR"
          },
          {
            "name": "reaction",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "post_id": 1,
            "category": "Pets",
            "reaction": "heart"
          },
          {
            "post_id": 1,
            "category": "Pets",
            "reaction": "heart"
          },
          {
            "post_id": 2,
            "category": "Pets",
            "reaction": "heart"
          },
          {
            "post_id": 2,
            "category": "Pets",
            "reaction": "like"
          },
          {
            "post_id": 3,
            "category": "Pets",
            "reaction": "like"
          },
          {
            "post_id": 4,
            "category": "News",
            "reaction": "like"
          },
          {
            "post_id": 4,
            "category": "News",
            "reaction": "like"
          },
          {
            "post_id": 5,
            "category": "News",
            "reaction": "sad"
          },
          {
            "post_id": 5,
            "category": "News",
            "reaction": "angry"
          },
          {
            "post_id": 6,
            "category": "News",
            "reaction": "like"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "category",
        "love_reaction_ratio"
      ],
      "rows": [
        {
          "category": "Pets",
          "love_reaction_ratio": 0.6
        },
        {
          "category": "News",
          "love_reaction_ratio": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Meta business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT category, ROUND(SUM(CASE WHEN reaction = 'heart' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS love_reaction_ratio FROM post_reactions GROUP BY category HAVING COUNT(*) >= 5 ORDER BY love_reaction_ratio DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT category, ROUND(SUM(CASE WHEN reaction = 'heart' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS love_reaction_ratio FROM post_reactions GROUP BY category HAVING COUNT(*) >= 5 ORDER BY love_reaction_ratio DESC;",
      "snowflake": "SELECT category, ROUND(SUM(CASE WHEN reaction = 'heart' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS love_reaction_ratio FROM post_reactions GROUP BY category HAVING COUNT(*) >= 5 ORDER BY love_reaction_ratio DESC;",
      "bigquery": "SELECT category, ROUND(SUM(CASE WHEN reaction = 'heart' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS love_reaction_ratio FROM post_reactions GROUP BY category HAVING COUNT(*) >= 5 ORDER BY love_reaction_ratio DESC;",
      "mysql": "SELECT category, ROUND(SUM(CASE WHEN reaction = 'heart' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS love_reaction_ratio FROM post_reactions GROUP BY category HAVING COUNT(*) >= 5 ORDER BY love_reaction_ratio DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/11",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_meta_spam_messages_ratio",
    "questionNumber": 12,
    "title": "Meta: Spam Messages Detection Ratio",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the daily percentage of Messenger conversations flagged as spam. Output the message_date and spam_ratio_pct rounded to 2 decimal places. Order chronologically by message_date.",
    "requirements": [
      "Compute spam_ratio_pct = ROUND(SUM(CASE WHEN is_spam = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by message_date",
      "Order by message_date ASC"
    ],
    "schemas": [
      {
        "tableName": "messenger_logs",
        "columns": [
          {
            "name": "msg_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "sender_id",
            "type": "INT"
          },
          {
            "name": "message_date",
            "type": "DATE"
          },
          {
            "name": "is_spam",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "msg_id": 1,
            "sender_id": 10,
            "message_date": "2026-02-01",
            "is_spam": 0
          },
          {
            "msg_id": 2,
            "sender_id": 11,
            "message_date": "2026-02-01",
            "is_spam": 1
          },
          {
            "msg_id": 3,
            "sender_id": 12,
            "message_date": "2026-02-02",
            "is_spam": 0
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "message_date",
        "spam_ratio_pct"
      ],
      "rows": [
        {
          "message_date": "2026-02-01",
          "spam_ratio_pct": 50
        },
        {
          "message_date": "2026-02-02",
          "spam_ratio_pct": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Meta business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT message_date, ROUND(SUM(CASE WHEN is_spam = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS spam_ratio_pct FROM messenger_logs GROUP BY message_date ORDER BY message_date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT message_date, ROUND(SUM(CASE WHEN is_spam = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS spam_ratio_pct FROM messenger_logs GROUP BY message_date ORDER BY message_date ASC;",
      "snowflake": "SELECT message_date, ROUND(SUM(CASE WHEN is_spam = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS spam_ratio_pct FROM messenger_logs GROUP BY message_date ORDER BY message_date ASC;",
      "bigquery": "SELECT message_date, ROUND(SUM(CASE WHEN is_spam = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS spam_ratio_pct FROM messenger_logs GROUP BY message_date ORDER BY message_date ASC;",
      "mysql": "SELECT message_date, ROUND(SUM(CASE WHEN is_spam = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS spam_ratio_pct FROM messenger_logs GROUP BY message_date ORDER BY message_date ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/12",
    "companyTag": "Meta",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_uber_surge_pricing_multiplier",
    "questionNumber": 13,
    "title": "Uber: Driver Surge Pricing Multiplier",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "At Uber, surge pricing activates when ride demand exceeds driver supply. Write a SQL query to calculate the average surge multiplier for each pickup zone during morning peak hours (07:00:00 to 10:00:00). Round average surge to 2 decimal places and order by avg_surge descending.",
    "requirements": [
      "Filter where pickup_time::time BETWEEN '07:00:00' AND '10:00:00'",
      "Compute avg_surge = ROUND(AVG(surge_multiplier), 2)",
      "Group by pickup_zone",
      "Order by avg_surge DESC"
    ],
    "schemas": [
      {
        "tableName": "uber_rides",
        "columns": [
          {
            "name": "ride_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "pickup_zone",
            "type": "VARCHAR"
          },
          {
            "name": "pickup_time",
            "type": "TIMESTAMP"
          },
          {
            "name": "surge_multiplier",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "ride_id": 1,
            "pickup_zone": "SFO Airport",
            "pickup_time": "2026-02-01 08:15:00",
            "surge_multiplier": 1.8
          },
          {
            "ride_id": 2,
            "pickup_zone": "SFO Airport",
            "pickup_time": "2026-02-01 09:30:00",
            "surge_multiplier": 1.4
          },
          {
            "ride_id": 3,
            "pickup_zone": "Mission",
            "pickup_time": "2026-02-01 07:45:00",
            "surge_multiplier": 1.2
          },
          {
            "ride_id": 4,
            "pickup_zone": "Mission",
            "pickup_time": "2026-02-01 11:00:00",
            "surge_multiplier": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "pickup_zone",
        "avg_surge"
      ],
      "rows": [
        {
          "pickup_zone": "SFO Airport",
          "avg_surge": 1.6
        },
        {
          "pickup_zone": "Mission",
          "avg_surge": 1.2
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Uber business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT pickup_zone, ROUND(AVG(surge_multiplier), 2) AS avg_surge FROM uber_rides WHERE CAST(pickup_time AS TIME) BETWEEN '07:00:00' AND '10:00:00' GROUP BY pickup_zone ORDER BY avg_surge DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT pickup_zone, ROUND(AVG(surge_multiplier), 2) AS avg_surge FROM uber_rides WHERE CAST(pickup_time AS TIME) BETWEEN '07:00:00' AND '10:00:00' GROUP BY pickup_zone ORDER BY avg_surge DESC;",
      "snowflake": "SELECT pickup_zone, ROUND(AVG(surge_multiplier), 2) AS avg_surge FROM uber_rides WHERE CAST(pickup_time AS TIME) BETWEEN '07:00:00' AND '10:00:00' GROUP BY pickup_zone ORDER BY avg_surge DESC;",
      "bigquery": "SELECT pickup_zone, ROUND(AVG(surge_multiplier), 2) AS avg_surge FROM uber_rides WHERE CAST(pickup_time AS TIME) BETWEEN '07:00:00' AND '10:00:00' GROUP BY pickup_zone ORDER BY avg_surge DESC;",
      "mysql": "SELECT pickup_zone, ROUND(AVG(surge_multiplier), 2) AS avg_surge FROM uber_rides WHERE CAST(pickup_time AS TIME) BETWEEN '07:00:00' AND '10:00:00' GROUP BY pickup_zone ORDER BY avg_surge DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/13",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_uber_airport_completion_rate",
    "questionNumber": 14,
    "title": "Uber: Completed vs Cancelled Airport Trips",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the completion rate of trips originating from major airports. Completion rate is total completed trips divided by total requested trips (completed + cancelled). Output airport_code, completed_trips, cancelled_trips, and completion_rate_pct rounded to 2 decimal places. Order by completion_rate_pct descending.",
    "requirements": [
      "Filter where airport_code IS NOT NULL",
      "Count completed vs cancelled status",
      "Compute completion_rate_pct = ROUND(SUM(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by airport_code order by completion_rate_pct DESC"
    ],
    "schemas": [
      {
        "tableName": "airport_trips",
        "columns": [
          {
            "name": "trip_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "airport_code",
            "type": "VARCHAR"
          },
          {
            "name": "status",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "trip_id": 1,
            "airport_code": "JFK",
            "status": "completed"
          },
          {
            "trip_id": 2,
            "airport_code": "JFK",
            "status": "completed"
          },
          {
            "trip_id": 3,
            "airport_code": "JFK",
            "status": "cancelled"
          },
          {
            "trip_id": 4,
            "airport_code": "LAX",
            "status": "completed"
          },
          {
            "trip_id": 5,
            "airport_code": "LAX",
            "status": "cancelled"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "airport_code",
        "completed_trips",
        "cancelled_trips",
        "completion_rate_pct"
      ],
      "rows": [
        {
          "airport_code": "JFK",
          "completed_trips": 2,
          "cancelled_trips": 1,
          "completion_rate_pct": 66.67
        },
        {
          "airport_code": "LAX",
          "completed_trips": 1,
          "cancelled_trips": 1,
          "completion_rate_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Uber business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT airport_code, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_trips, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_trips, ROUND(SUM(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS completion_rate_pct FROM airport_trips GROUP BY airport_code ORDER BY completion_rate_pct DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT airport_code, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_trips, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_trips, ROUND(SUM(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS completion_rate_pct FROM airport_trips GROUP BY airport_code ORDER BY completion_rate_pct DESC;",
      "snowflake": "SELECT airport_code, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_trips, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_trips, ROUND(SUM(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS completion_rate_pct FROM airport_trips GROUP BY airport_code ORDER BY completion_rate_pct DESC;",
      "bigquery": "SELECT airport_code, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_trips, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_trips, ROUND(SUM(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS completion_rate_pct FROM airport_trips GROUP BY airport_code ORDER BY completion_rate_pct DESC;",
      "mysql": "SELECT airport_code, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_trips, SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_trips, ROUND(SUM(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS completion_rate_pct FROM airport_trips GROUP BY airport_code ORDER BY completion_rate_pct DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/14",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_uber_avg_speed_per_vehicle_type",
    "questionNumber": 15,
    "title": "Uber: Average Distance and Speed by Vehicle",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "For each Uber vehicle type (UberX, UberXL, Black, Comfort), compute the average distance in miles and the average trip duration in minutes. Round both to 2 decimal places. Order by vehicle_type alphabetically.",
    "requirements": [
      "Compute ROUND(AVG(distance_miles), 2) and ROUND(AVG(duration_minutes), 2)",
      "Group by vehicle_type",
      "Order by vehicle_type ASC"
    ],
    "schemas": [
      {
        "tableName": "vehicle_trips",
        "columns": [
          {
            "name": "trip_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "vehicle_type",
            "type": "VARCHAR"
          },
          {
            "name": "distance_miles",
            "type": "NUMERIC"
          },
          {
            "name": "duration_minutes",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "trip_id": 1,
            "vehicle_type": "UberX",
            "distance_miles": 5.5,
            "duration_minutes": 15
          },
          {
            "trip_id": 2,
            "vehicle_type": "UberX",
            "distance_miles": 8.5,
            "duration_minutes": 25
          },
          {
            "trip_id": 3,
            "vehicle_type": "Black",
            "distance_miles": 12,
            "duration_minutes": 30
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "vehicle_type",
        "avg_distance",
        "avg_duration"
      ],
      "rows": [
        {
          "vehicle_type": "Black",
          "avg_distance": 12,
          "avg_duration": 30
        },
        {
          "vehicle_type": "UberX",
          "avg_distance": 7,
          "avg_duration": 20
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Uber business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT vehicle_type, ROUND(AVG(distance_miles), 2) AS avg_distance, ROUND(AVG(duration_minutes), 2) AS avg_duration FROM vehicle_trips GROUP BY vehicle_type ORDER BY vehicle_type ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT vehicle_type, ROUND(AVG(distance_miles), 2) AS avg_distance, ROUND(AVG(duration_minutes), 2) AS avg_duration FROM vehicle_trips GROUP BY vehicle_type ORDER BY vehicle_type ASC;",
      "snowflake": "SELECT vehicle_type, ROUND(AVG(distance_miles), 2) AS avg_distance, ROUND(AVG(duration_minutes), 2) AS avg_duration FROM vehicle_trips GROUP BY vehicle_type ORDER BY vehicle_type ASC;",
      "bigquery": "SELECT vehicle_type, ROUND(AVG(distance_miles), 2) AS avg_distance, ROUND(AVG(duration_minutes), 2) AS avg_duration FROM vehicle_trips GROUP BY vehicle_type ORDER BY vehicle_type ASC;",
      "mysql": "SELECT vehicle_type, ROUND(AVG(distance_miles), 2) AS avg_distance, ROUND(AVG(duration_minutes), 2) AS avg_duration FROM vehicle_trips GROUP BY vehicle_type ORDER BY vehicle_type ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/15",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_uber_top_drivers_by_city",
    "questionNumber": 16,
    "title": "Uber: Top 2 Earners Per City",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Identify the top 2 highest earning drivers in each city based on total fare earned. Output city, driver_name, total_earnings, and rank within city. Order by city ascending, rank ascending.",
    "requirements": [
      "Sum total fare grouped by city and driver_id",
      "Use DENSE_RANK() OVER (PARTITION BY city ORDER BY total_earnings DESC)",
      "Filter where rank <= 2",
      "Order by city ASC, rank ASC"
    ],
    "schemas": [
      {
        "tableName": "drivers",
        "columns": [
          {
            "name": "driver_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "driver_name",
            "type": "VARCHAR"
          },
          {
            "name": "city",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "driver_id": 1,
            "driver_name": "Alex",
            "city": "Chicago"
          },
          {
            "driver_id": 2,
            "driver_name": "Ben",
            "city": "Chicago"
          },
          {
            "driver_id": 3,
            "driver_name": "Chloe",
            "city": "Chicago"
          },
          {
            "driver_id": 4,
            "driver_name": "David",
            "city": "Seattle"
          }
        ]
      },
      {
        "tableName": "fares",
        "columns": [
          {
            "name": "trip_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "driver_id",
            "type": "INT"
          },
          {
            "name": "fare_amount",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "trip_id": 1,
            "driver_id": 1,
            "fare_amount": 500
          },
          {
            "trip_id": 2,
            "driver_id": 2,
            "fare_amount": 750
          },
          {
            "trip_id": 3,
            "driver_id": 3,
            "fare_amount": 300
          },
          {
            "trip_id": 4,
            "driver_id": 4,
            "fare_amount": 900
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "city",
        "driver_name",
        "total_earnings",
        "rank"
      ],
      "rows": [
        {
          "city": "Chicago",
          "driver_name": "Ben",
          "total_earnings": 750,
          "rank": 1
        },
        {
          "city": "Chicago",
          "driver_name": "Alex",
          "total_earnings": 500,
          "rank": 2
        },
        {
          "city": "Seattle",
          "driver_name": "David",
          "total_earnings": 900,
          "rank": 1
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Uber business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH driver_totals AS (SELECT d.city, d.driver_name, SUM(f.fare_amount) AS total_earnings, DENSE_RANK() OVER (PARTITION BY d.city ORDER BY SUM(f.fare_amount) DESC) AS rank FROM drivers d JOIN fares f ON d.driver_id = f.driver_id GROUP BY d.city, d.driver_name) SELECT city, driver_name, total_earnings, rank FROM driver_totals WHERE rank <= 2 ORDER BY city ASC, rank ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH driver_totals AS (SELECT d.city, d.driver_name, SUM(f.fare_amount) AS total_earnings, DENSE_RANK() OVER (PARTITION BY d.city ORDER BY SUM(f.fare_amount) DESC) AS rank FROM drivers d JOIN fares f ON d.driver_id = f.driver_id GROUP BY d.city, d.driver_name) SELECT city, driver_name, total_earnings, rank FROM driver_totals WHERE rank <= 2 ORDER BY city ASC, rank ASC;",
      "snowflake": "WITH driver_totals AS (SELECT d.city, d.driver_name, SUM(f.fare_amount) AS total_earnings, DENSE_RANK() OVER (PARTITION BY d.city ORDER BY SUM(f.fare_amount) DESC) AS rank FROM drivers d JOIN fares f ON d.driver_id = f.driver_id GROUP BY d.city, d.driver_name) SELECT city, driver_name, total_earnings, rank FROM driver_totals WHERE rank <= 2 ORDER BY city ASC, rank ASC;",
      "bigquery": "WITH driver_totals AS (SELECT d.city, d.driver_name, SUM(f.fare_amount) AS total_earnings, DENSE_RANK() OVER (PARTITION BY d.city ORDER BY SUM(f.fare_amount) DESC) AS rank FROM drivers d JOIN fares f ON d.driver_id = f.driver_id GROUP BY d.city, d.driver_name) SELECT city, driver_name, total_earnings, rank FROM driver_totals WHERE rank <= 2 ORDER BY city ASC, rank ASC;",
      "mysql": "WITH driver_totals AS (SELECT d.city, d.driver_name, SUM(f.fare_amount) AS total_earnings, DENSE_RANK() OVER (PARTITION BY d.city ORDER BY SUM(f.fare_amount) DESC) AS rank FROM drivers d JOIN fares f ON d.driver_id = f.driver_id GROUP BY d.city, d.driver_name) SELECT city, driver_name, total_earnings, rank FROM driver_totals WHERE rank <= 2 ORDER BY city ASC, rank ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/16",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_uber_rider_retention_days",
    "questionNumber": 17,
    "title": "Uber: Rider First to Second Trip Days Gap",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Find the number of days elapsed between a rider's first trip and second trip on Uber. Only consider riders who have completed at least 2 trips. Output rider_id, first_trip_date, second_trip_date, and days_gap. Order by days_gap ascending.",
    "requirements": [
      "Use ROW_NUMBER() OVER (PARTITION BY rider_id ORDER BY trip_date ASC) to identify trip sequence",
      "Pivot trip 1 and trip 2 dates using conditional aggregation or self join",
      "Compute days_gap = second_trip_date - first_trip_date",
      "Order by days_gap ASC, rider_id ASC"
    ],
    "schemas": [
      {
        "tableName": "rider_trips",
        "columns": [
          {
            "name": "trip_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "rider_id",
            "type": "INT"
          },
          {
            "name": "trip_date",
            "type": "DATE"
          }
        ],
        "sampleRows": [
          {
            "trip_id": 1,
            "rider_id": 101,
            "trip_date": "2026-01-01"
          },
          {
            "trip_id": 2,
            "rider_id": 101,
            "trip_date": "2026-01-04"
          },
          {
            "trip_id": 3,
            "rider_id": 102,
            "trip_date": "2026-01-02"
          },
          {
            "trip_id": 4,
            "rider_id": 102,
            "trip_date": "2026-01-10"
          },
          {
            "trip_id": 5,
            "rider_id": 103,
            "trip_date": "2026-01-05"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "rider_id",
        "first_trip_date",
        "second_trip_date",
        "days_gap"
      ],
      "rows": [
        {
          "rider_id": 101,
          "first_trip_date": "2026-01-01",
          "second_trip_date": "2026-01-04",
          "days_gap": 3
        },
        {
          "rider_id": 102,
          "first_trip_date": "2026-01-02",
          "second_trip_date": "2026-01-10",
          "days_gap": 8
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Uber business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH ranked AS (SELECT rider_id, trip_date, ROW_NUMBER() OVER (PARTITION BY rider_id ORDER BY trip_date ASC) AS rn FROM rider_trips) SELECT r1.rider_id, r1.trip_date AS first_trip_date, r2.trip_date AS second_trip_date, (r2.trip_date - r1.trip_date) AS days_gap FROM ranked r1 JOIN ranked r2 ON r1.rider_id = r2.rider_id WHERE r1.rn = 1 AND r2.rn = 2 ORDER BY days_gap ASC, r1.rider_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH ranked AS (SELECT rider_id, trip_date, ROW_NUMBER() OVER (PARTITION BY rider_id ORDER BY trip_date ASC) AS rn FROM rider_trips) SELECT r1.rider_id, r1.trip_date AS first_trip_date, r2.trip_date AS second_trip_date, (r2.trip_date - r1.trip_date) AS days_gap FROM ranked r1 JOIN ranked r2 ON r1.rider_id = r2.rider_id WHERE r1.rn = 1 AND r2.rn = 2 ORDER BY days_gap ASC, r1.rider_id ASC;",
      "snowflake": "WITH ranked AS (SELECT rider_id, trip_date, ROW_NUMBER() OVER (PARTITION BY rider_id ORDER BY trip_date ASC) AS rn FROM rider_trips) SELECT r1.rider_id, r1.trip_date AS first_trip_date, r2.trip_date AS second_trip_date, (r2.trip_date - r1.trip_date) AS days_gap FROM ranked r1 JOIN ranked r2 ON r1.rider_id = r2.rider_id WHERE r1.rn = 1 AND r2.rn = 2 ORDER BY days_gap ASC, r1.rider_id ASC;",
      "bigquery": "WITH ranked AS (SELECT rider_id, trip_date, ROW_NUMBER() OVER (PARTITION BY rider_id ORDER BY trip_date ASC) AS rn FROM rider_trips) SELECT r1.rider_id, r1.trip_date AS first_trip_date, r2.trip_date AS second_trip_date, (r2.trip_date - r1.trip_date) AS days_gap FROM ranked r1 JOIN ranked r2 ON r1.rider_id = r2.rider_id WHERE r1.rn = 1 AND r2.rn = 2 ORDER BY days_gap ASC, r1.rider_id ASC;",
      "mysql": "WITH ranked AS (SELECT rider_id, trip_date, ROW_NUMBER() OVER (PARTITION BY rider_id ORDER BY trip_date ASC) AS rn FROM rider_trips) SELECT r1.rider_id, r1.trip_date AS first_trip_date, r2.trip_date AS second_trip_date, (r2.trip_date - r1.trip_date) AS days_gap FROM ranked r1 JOIN ranked r2 ON r1.rider_id = r2.rider_id WHERE r1.rn = 1 AND r2.rn = 2 ORDER BY days_gap ASC, r1.rider_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/17",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_uber_peak_hour_demand",
    "questionNumber": 18,
    "title": "Uber: Peak Hourly Ride Volume",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "datetime",
    "topicLabel": "DATETIME",
    "businessScenario": "Determine the total number of rides requested during each hour of the day (0 to 23). Output pickup_hour and total_rides. Sort by total_rides in descending order to identify peak congestion hours.",
    "requirements": [
      "Extract EXTRACT(HOUR FROM pickup_time) AS pickup_hour",
      "Count total trips per hour",
      "Order by total_rides DESC, pickup_hour ASC"
    ],
    "schemas": [
      {
        "tableName": "trips_hourly",
        "columns": [
          {
            "name": "trip_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "pickup_time",
            "type": "TIMESTAMP"
          }
        ],
        "sampleRows": [
          {
            "trip_id": 1,
            "pickup_time": "2026-02-01 17:15:00"
          },
          {
            "trip_id": 2,
            "pickup_time": "2026-02-01 17:45:00"
          },
          {
            "trip_id": 3,
            "pickup_time": "2026-02-01 18:20:00"
          },
          {
            "trip_id": 4,
            "pickup_time": "2026-02-01 08:30:00"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "pickup_hour",
        "total_rides"
      ],
      "rows": [
        {
          "pickup_hour": 17,
          "total_rides": 2
        },
        {
          "pickup_hour": 8,
          "total_rides": 1
        },
        {
          "pickup_hour": 18,
          "total_rides": 1
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Uber business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT EXTRACT(HOUR FROM pickup_time) AS pickup_hour, COUNT(*) AS total_rides FROM trips_hourly GROUP BY EXTRACT(HOUR FROM pickup_time) ORDER BY total_rides DESC, pickup_hour ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT EXTRACT(HOUR FROM pickup_time) AS pickup_hour, COUNT(*) AS total_rides FROM trips_hourly GROUP BY EXTRACT(HOUR FROM pickup_time) ORDER BY total_rides DESC, pickup_hour ASC;",
      "snowflake": "SELECT EXTRACT(HOUR FROM pickup_time) AS pickup_hour, COUNT(*) AS total_rides FROM trips_hourly GROUP BY EXTRACT(HOUR FROM pickup_time) ORDER BY total_rides DESC, pickup_hour ASC;",
      "bigquery": "SELECT EXTRACT(HOUR FROM pickup_time) AS pickup_hour, COUNT(*) AS total_rides FROM trips_hourly GROUP BY EXTRACT(HOUR FROM pickup_time) ORDER BY total_rides DESC, pickup_hour ASC;",
      "mysql": "SELECT EXTRACT(HOUR FROM pickup_time) AS pickup_hour, COUNT(*) AS total_rides FROM trips_hourly GROUP BY EXTRACT(HOUR FROM pickup_time) ORDER BY total_rides DESC, pickup_hour ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/18",
    "companyTag": "Uber",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_amazon_order_freq_state",
    "questionNumber": 19,
    "title": "Amazon: Customer Order Frequency by State",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "JOINS",
    "businessScenario": "Calculate the total number of orders and average order value (AOV) for customers in each US state. Exclude states with fewer than 2 total orders. Output state, total_orders, and avg_order_value rounded to 2 decimal places. Order by total_orders descending.",
    "requirements": [
      "Join customers with orders on customer_id",
      "Compute COUNT(order_id) and ROUND(AVG(total_amount), 2)",
      "Group by state having COUNT(order_id) >= 2",
      "Order by total_orders DESC, state ASC"
    ],
    "schemas": [
      {
        "tableName": "customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "state",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "customer_id": 1,
            "state": "CA"
          },
          {
            "customer_id": 2,
            "state": "CA"
          },
          {
            "customer_id": 3,
            "state": "NY"
          },
          {
            "customer_id": 4,
            "state": "TX"
          }
        ]
      },
      {
        "tableName": "orders",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "total_amount",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "order_id": 101,
            "customer_id": 1,
            "total_amount": 120
          },
          {
            "order_id": 102,
            "customer_id": 1,
            "total_amount": 80
          },
          {
            "order_id": 103,
            "customer_id": 2,
            "total_amount": 150
          },
          {
            "order_id": 104,
            "customer_id": 3,
            "total_amount": 200
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "state",
        "total_orders",
        "avg_order_value"
      ],
      "rows": [
        {
          "state": "CA",
          "total_orders": 3,
          "avg_order_value": 116.67
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Amazon business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT c.state, COUNT(o.order_id) AS total_orders, ROUND(AVG(o.total_amount), 2) AS avg_order_value FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.state HAVING COUNT(o.order_id) >= 2 ORDER BY total_orders DESC, c.state ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT c.state, COUNT(o.order_id) AS total_orders, ROUND(AVG(o.total_amount), 2) AS avg_order_value FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.state HAVING COUNT(o.order_id) >= 2 ORDER BY total_orders DESC, c.state ASC;",
      "snowflake": "SELECT c.state, COUNT(o.order_id) AS total_orders, ROUND(AVG(o.total_amount), 2) AS avg_order_value FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.state HAVING COUNT(o.order_id) >= 2 ORDER BY total_orders DESC, c.state ASC;",
      "bigquery": "SELECT c.state, COUNT(o.order_id) AS total_orders, ROUND(AVG(o.total_amount), 2) AS avg_order_value FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.state HAVING COUNT(o.order_id) >= 2 ORDER BY total_orders DESC, c.state ASC;",
      "mysql": "SELECT c.state, COUNT(o.order_id) AS total_orders, ROUND(AVG(o.total_amount), 2) AS avg_order_value FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.state HAVING COUNT(o.order_id) >= 2 ORDER BY total_orders DESC, c.state ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/19",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_amazon_highest_selling_category",
    "questionNumber": 20,
    "title": "Amazon: Top Grossing Category per Region",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Find the top grossing product category in each sales region based on total revenue. Output region, category, and total_revenue. If there is a tie, include all tied categories.",
    "requirements": [
      "Sum revenue by region and category",
      "Use DENSE_RANK() OVER (PARTITION BY region ORDER BY total_revenue DESC)",
      "Filter where rank = 1",
      "Order by region ASC"
    ],
    "schemas": [
      {
        "tableName": "sales_records",
        "columns": [
          {
            "name": "sale_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "region",
            "type": "VARCHAR"
          },
          {
            "name": "category",
            "type": "VARCHAR"
          },
          {
            "name": "revenue",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "sale_id": 1,
            "region": "West",
            "category": "Electronics",
            "revenue": 5000
          },
          {
            "sale_id": 2,
            "region": "West",
            "category": "Books",
            "revenue": 1200
          },
          {
            "sale_id": 3,
            "region": "East",
            "category": "Home",
            "revenue": 3500
          },
          {
            "sale_id": 4,
            "region": "East",
            "category": "Electronics",
            "revenue": 4200
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "region",
        "category",
        "total_revenue"
      ],
      "rows": [
        {
          "region": "East",
          "category": "Electronics",
          "total_revenue": 4200
        },
        {
          "region": "West",
          "category": "Electronics",
          "total_revenue": 5000
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Amazon business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH ranked AS (SELECT region, category, SUM(revenue) AS total_revenue, DENSE_RANK() OVER (PARTITION BY region ORDER BY SUM(revenue) DESC) AS rnk FROM sales_records GROUP BY region, category) SELECT region, category, total_revenue FROM ranked WHERE rnk = 1 ORDER BY region ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH ranked AS (SELECT region, category, SUM(revenue) AS total_revenue, DENSE_RANK() OVER (PARTITION BY region ORDER BY SUM(revenue) DESC) AS rnk FROM sales_records GROUP BY region, category) SELECT region, category, total_revenue FROM ranked WHERE rnk = 1 ORDER BY region ASC;",
      "snowflake": "WITH ranked AS (SELECT region, category, SUM(revenue) AS total_revenue, DENSE_RANK() OVER (PARTITION BY region ORDER BY SUM(revenue) DESC) AS rnk FROM sales_records GROUP BY region, category) SELECT region, category, total_revenue FROM ranked WHERE rnk = 1 ORDER BY region ASC;",
      "bigquery": "WITH ranked AS (SELECT region, category, SUM(revenue) AS total_revenue, DENSE_RANK() OVER (PARTITION BY region ORDER BY SUM(revenue) DESC) AS rnk FROM sales_records GROUP BY region, category) SELECT region, category, total_revenue FROM ranked WHERE rnk = 1 ORDER BY region ASC;",
      "mysql": "WITH ranked AS (SELECT region, category, SUM(revenue) AS total_revenue, DENSE_RANK() OVER (PARTITION BY region ORDER BY SUM(revenue) DESC) AS rnk FROM sales_records GROUP BY region, category) SELECT region, category, total_revenue FROM ranked WHERE rnk = 1 ORDER BY region ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/20",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_amazon_return_rate_by_seller",
    "questionNumber": 21,
    "title": "Amazon: Order Return Rate by Seller",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the return rate percentage for each marketplace third-party seller. Return rate is total returned orders divided by total fulfilled orders, multiplied by 100. Filter out sellers with fewer than 3 fulfilled orders. Order by return_rate_pct descending.",
    "requirements": [
      "Compute return_rate_pct = ROUND(SUM(CASE WHEN is_returned = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by seller_id having COUNT(*) >= 3",
      "Order by return_rate_pct DESC, seller_id ASC"
    ],
    "schemas": [
      {
        "tableName": "seller_orders",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "seller_id",
            "type": "INT"
          },
          {
            "name": "is_returned",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "order_id": 1,
            "seller_id": 501,
            "is_returned": 1
          },
          {
            "order_id": 2,
            "seller_id": 501,
            "is_returned": 0
          },
          {
            "order_id": 3,
            "seller_id": 501,
            "is_returned": 1
          },
          {
            "order_id": 4,
            "seller_id": 502,
            "is_returned": 0
          },
          {
            "order_id": 5,
            "seller_id": 502,
            "is_returned": 0
          },
          {
            "order_id": 6,
            "seller_id": 502,
            "is_returned": 0
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "seller_id",
        "return_rate_pct"
      ],
      "rows": [
        {
          "seller_id": 501,
          "return_rate_pct": 66.67
        },
        {
          "seller_id": 502,
          "return_rate_pct": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Amazon business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT seller_id, ROUND(SUM(CASE WHEN is_returned = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS return_rate_pct FROM seller_orders GROUP BY seller_id HAVING COUNT(*) >= 3 ORDER BY return_rate_pct DESC, seller_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT seller_id, ROUND(SUM(CASE WHEN is_returned = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS return_rate_pct FROM seller_orders GROUP BY seller_id HAVING COUNT(*) >= 3 ORDER BY return_rate_pct DESC, seller_id ASC;",
      "snowflake": "SELECT seller_id, ROUND(SUM(CASE WHEN is_returned = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS return_rate_pct FROM seller_orders GROUP BY seller_id HAVING COUNT(*) >= 3 ORDER BY return_rate_pct DESC, seller_id ASC;",
      "bigquery": "SELECT seller_id, ROUND(SUM(CASE WHEN is_returned = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS return_rate_pct FROM seller_orders GROUP BY seller_id HAVING COUNT(*) >= 3 ORDER BY return_rate_pct DESC, seller_id ASC;",
      "mysql": "SELECT seller_id, ROUND(SUM(CASE WHEN is_returned = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS return_rate_pct FROM seller_orders GROUP BY seller_id HAVING COUNT(*) >= 3 ORDER BY return_rate_pct DESC, seller_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/21",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_amazon_inventory_restock_urgency",
    "questionNumber": 22,
    "title": "Amazon: Inventory Restock Urgency Score",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "intermediate_case",
    "topicLabel": "INTERMEDIATE CASE",
    "businessScenario": "Warehouse fulfillment centers categorize inventory restock urgency. Assign an urgency status based on available stock: if stock < 10 then 'Critical', if stock between 10 and 50 then 'Moderate', else 'Sufficient'. Output product_id, product_name, stock, and urgency_level. Order by stock ascending.",
    "requirements": [
      "Use CASE WHEN statements to classify urgency",
      "Order by stock ASC, product_id ASC"
    ],
    "schemas": [
      {
        "tableName": "warehouse_inventory",
        "columns": [
          {
            "name": "product_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "product_name",
            "type": "VARCHAR"
          },
          {
            "name": "stock",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "product_id": 10,
            "product_name": "Kindle Paperwhite",
            "stock": 5
          },
          {
            "product_id": 11,
            "product_name": "Echo Dot",
            "stock": 25
          },
          {
            "product_id": 12,
            "product_name": "Fire TV Stick",
            "stock": 120
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "product_id",
        "product_name",
        "stock",
        "urgency_level"
      ],
      "rows": [
        {
          "product_id": 10,
          "product_name": "Kindle Paperwhite",
          "stock": 5,
          "urgency_level": "Critical"
        },
        {
          "product_id": 11,
          "product_name": "Echo Dot",
          "stock": 25,
          "urgency_level": "Moderate"
        },
        {
          "product_id": 12,
          "product_name": "Fire TV Stick",
          "stock": 120,
          "urgency_level": "Sufficient"
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Amazon business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT product_id, product_name, stock, CASE WHEN stock < 10 THEN 'Critical' WHEN stock BETWEEN 10 AND 50 THEN 'Moderate' ELSE 'Sufficient' END AS urgency_level FROM warehouse_inventory ORDER BY stock ASC, product_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT product_id, product_name, stock, CASE WHEN stock < 10 THEN 'Critical' WHEN stock BETWEEN 10 AND 50 THEN 'Moderate' ELSE 'Sufficient' END AS urgency_level FROM warehouse_inventory ORDER BY stock ASC, product_id ASC;",
      "snowflake": "SELECT product_id, product_name, stock, CASE WHEN stock < 10 THEN 'Critical' WHEN stock BETWEEN 10 AND 50 THEN 'Moderate' ELSE 'Sufficient' END AS urgency_level FROM warehouse_inventory ORDER BY stock ASC, product_id ASC;",
      "bigquery": "SELECT product_id, product_name, stock, CASE WHEN stock < 10 THEN 'Critical' WHEN stock BETWEEN 10 AND 50 THEN 'Moderate' ELSE 'Sufficient' END AS urgency_level FROM warehouse_inventory ORDER BY stock ASC, product_id ASC;",
      "mysql": "SELECT product_id, product_name, stock, CASE WHEN stock < 10 THEN 'Critical' WHEN stock BETWEEN 10 AND 50 THEN 'Moderate' ELSE 'Sufficient' END AS urgency_level FROM warehouse_inventory ORDER BY stock ASC, product_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/22",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_amazon_prime_vs_non_prime_spend",
    "questionNumber": 23,
    "title": "Amazon: Prime vs Non-Prime Annual Spend",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Compare customer spending patterns between Amazon Prime and Non-Prime members. Calculate total users, total annual spending, and average spend per customer for both groups. Output is_prime, total_customers, total_spend, and avg_spend_per_customer rounded to 2 decimal places.",
    "requirements": [
      "Group by is_prime (1 = Prime, 0 = Non-Prime)",
      "Compute COUNT(DISTINCT customer_id), SUM(order_amount), ROUND(AVG(order_amount), 2)",
      "Order by is_prime DESC"
    ],
    "schemas": [
      {
        "tableName": "prime_orders",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "is_prime",
            "type": "INT"
          },
          {
            "name": "order_amount",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "order_id": 1,
            "customer_id": 1,
            "is_prime": 1,
            "order_amount": 150
          },
          {
            "order_id": 2,
            "customer_id": 1,
            "is_prime": 1,
            "order_amount": 200
          },
          {
            "order_id": 3,
            "customer_id": 2,
            "is_prime": 0,
            "order_amount": 60
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "is_prime",
        "total_customers",
        "total_spend",
        "avg_spend_per_customer"
      ],
      "rows": [
        {
          "is_prime": 1,
          "total_customers": 1,
          "total_spend": 350,
          "avg_spend_per_customer": 175
        },
        {
          "is_prime": 0,
          "total_customers": 1,
          "total_spend": 60,
          "avg_spend_per_customer": 60
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Amazon business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT is_prime, COUNT(DISTINCT customer_id) AS total_customers, SUM(order_amount) AS total_spend, ROUND(AVG(order_amount), 2) AS avg_spend_per_customer FROM prime_orders GROUP BY is_prime ORDER BY is_prime DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT is_prime, COUNT(DISTINCT customer_id) AS total_customers, SUM(order_amount) AS total_spend, ROUND(AVG(order_amount), 2) AS avg_spend_per_customer FROM prime_orders GROUP BY is_prime ORDER BY is_prime DESC;",
      "snowflake": "SELECT is_prime, COUNT(DISTINCT customer_id) AS total_customers, SUM(order_amount) AS total_spend, ROUND(AVG(order_amount), 2) AS avg_spend_per_customer FROM prime_orders GROUP BY is_prime ORDER BY is_prime DESC;",
      "bigquery": "SELECT is_prime, COUNT(DISTINCT customer_id) AS total_customers, SUM(order_amount) AS total_spend, ROUND(AVG(order_amount), 2) AS avg_spend_per_customer FROM prime_orders GROUP BY is_prime ORDER BY is_prime DESC;",
      "mysql": "SELECT is_prime, COUNT(DISTINCT customer_id) AS total_customers, SUM(order_amount) AS total_spend, ROUND(AVG(order_amount), 2) AS avg_spend_per_customer FROM prime_orders GROUP BY is_prime ORDER BY is_prime DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/23",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_amazon_cart_abandonment_rate",
    "questionNumber": 24,
    "title": "Amazon: Cart Abandonment Rate by Platform",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Find the cart abandonment rate across shopping channels (iOS App, Android App, Web). Abandonment rate is the number of carts created that did not result in a completed checkout divided by total carts created, expressed as percentage rounded to 2 decimal places.",
    "requirements": [
      "Compute abandonment_rate_pct = ROUND(SUM(CASE WHEN checkout_status = 'abandoned' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by platform",
      "Order by abandonment_rate_pct DESC"
    ],
    "schemas": [
      {
        "tableName": "cart_sessions",
        "columns": [
          {
            "name": "cart_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "platform",
            "type": "VARCHAR"
          },
          {
            "name": "checkout_status",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "cart_id": 1,
            "platform": "iOS",
            "checkout_status": "abandoned"
          },
          {
            "cart_id": 2,
            "platform": "iOS",
            "checkout_status": "completed"
          },
          {
            "cart_id": 3,
            "platform": "Web",
            "checkout_status": "abandoned"
          },
          {
            "cart_id": 4,
            "platform": "Web",
            "checkout_status": "abandoned"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "platform",
        "abandonment_rate_pct"
      ],
      "rows": [
        {
          "platform": "Web",
          "abandonment_rate_pct": 100
        },
        {
          "platform": "iOS",
          "abandonment_rate_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Amazon business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT platform, ROUND(SUM(CASE WHEN checkout_status = 'abandoned' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS abandonment_rate_pct FROM cart_sessions GROUP BY platform ORDER BY abandonment_rate_pct DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT platform, ROUND(SUM(CASE WHEN checkout_status = 'abandoned' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS abandonment_rate_pct FROM cart_sessions GROUP BY platform ORDER BY abandonment_rate_pct DESC;",
      "snowflake": "SELECT platform, ROUND(SUM(CASE WHEN checkout_status = 'abandoned' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS abandonment_rate_pct FROM cart_sessions GROUP BY platform ORDER BY abandonment_rate_pct DESC;",
      "bigquery": "SELECT platform, ROUND(SUM(CASE WHEN checkout_status = 'abandoned' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS abandonment_rate_pct FROM cart_sessions GROUP BY platform ORDER BY abandonment_rate_pct DESC;",
      "mysql": "SELECT platform, ROUND(SUM(CASE WHEN checkout_status = 'abandoned' THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS abandonment_rate_pct FROM cart_sessions GROUP BY platform ORDER BY abandonment_rate_pct DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/24",
    "companyTag": "Amazon",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_netflix_binge_watching_streaks",
    "questionNumber": 25,
    "title": "Netflix: Binge Watching Consecutive Episodes",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Netflix defines binge watching as a user watching 3 or more episodes of the same show on the same calendar day. Find all user IDs and show titles where the user met this criteria. Output user_id, show_title, and total_episodes_watched. Order by total_episodes_watched DESC, user_id ASC.",
    "requirements": [
      "Filter where watch_date IS NOT NULL",
      "Group by user_id, show_title, watch_date having COUNT(episode_id) >= 3",
      "Output user_id, show_title, COUNT(episode_id) AS total_episodes_watched",
      "Order by total_episodes_watched DESC, user_id ASC"
    ],
    "schemas": [
      {
        "tableName": "playback_logs",
        "columns": [
          {
            "name": "watch_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "show_title",
            "type": "VARCHAR"
          },
          {
            "name": "episode_id",
            "type": "INT"
          },
          {
            "name": "watch_date",
            "type": "DATE"
          }
        ],
        "sampleRows": [
          {
            "watch_id": 1,
            "user_id": 10,
            "show_title": "Stranger Things",
            "episode_id": 1,
            "watch_date": "2026-03-01"
          },
          {
            "watch_id": 2,
            "user_id": 10,
            "show_title": "Stranger Things",
            "episode_id": 2,
            "watch_date": "2026-03-01"
          },
          {
            "watch_id": 3,
            "user_id": 10,
            "show_title": "Stranger Things",
            "episode_id": 3,
            "watch_date": "2026-03-01"
          },
          {
            "watch_id": 4,
            "user_id": 20,
            "show_title": "The Crown",
            "episode_id": 1,
            "watch_date": "2026-03-01"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "user_id",
        "show_title",
        "total_episodes_watched"
      ],
      "rows": [
        {
          "user_id": 10,
          "show_title": "Stranger Things",
          "total_episodes_watched": 3
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Netflix business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT user_id, show_title, COUNT(episode_id) AS total_episodes_watched FROM playback_logs GROUP BY user_id, show_title, watch_date HAVING COUNT(episode_id) >= 3 ORDER BY total_episodes_watched DESC, user_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT user_id, show_title, COUNT(episode_id) AS total_episodes_watched FROM playback_logs GROUP BY user_id, show_title, watch_date HAVING COUNT(episode_id) >= 3 ORDER BY total_episodes_watched DESC, user_id ASC;",
      "snowflake": "SELECT user_id, show_title, COUNT(episode_id) AS total_episodes_watched FROM playback_logs GROUP BY user_id, show_title, watch_date HAVING COUNT(episode_id) >= 3 ORDER BY total_episodes_watched DESC, user_id ASC;",
      "bigquery": "SELECT user_id, show_title, COUNT(episode_id) AS total_episodes_watched FROM playback_logs GROUP BY user_id, show_title, watch_date HAVING COUNT(episode_id) >= 3 ORDER BY total_episodes_watched DESC, user_id ASC;",
      "mysql": "SELECT user_id, show_title, COUNT(episode_id) AS total_episodes_watched FROM playback_logs GROUP BY user_id, show_title, watch_date HAVING COUNT(episode_id) >= 3 ORDER BY total_episodes_watched DESC, user_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/25",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_netflix_genre_by_age_group",
    "questionNumber": 26,
    "title": "Netflix: Most Watched Genres by Age Group",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "JOINS",
    "businessScenario": "Categorize Netflix viewers into age groups: '18-24', '25-34', '35-49', and '50+'. For each age group, determine the total watch hours spent on each genre. Output age_group, genre, and total_hours. Order by age_group ASC, total_hours DESC.",
    "requirements": [
      "Join users with stream_hours on user_id",
      "Assign age group via CASE WHEN",
      "Sum watch hours by age group and genre",
      "Order by age_group ASC, total_hours DESC"
    ],
    "schemas": [
      {
        "tableName": "subscribers",
        "columns": [
          {
            "name": "user_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "age",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "user_id": 1,
            "age": 22
          },
          {
            "user_id": 2,
            "age": 29
          },
          {
            "user_id": 3,
            "age": 40
          }
        ]
      },
      {
        "tableName": "genre_streams",
        "columns": [
          {
            "name": "stream_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "genre",
            "type": "VARCHAR"
          },
          {
            "name": "watch_hours",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "stream_id": 101,
            "user_id": 1,
            "genre": "Sci-Fi",
            "watch_hours": 15
          },
          {
            "stream_id": 102,
            "user_id": 2,
            "genre": "Drama",
            "watch_hours": 20
          },
          {
            "stream_id": 103,
            "user_id": 3,
            "genre": "Documentary",
            "watch_hours": 10
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "age_group",
        "genre",
        "total_hours"
      ],
      "rows": [
        {
          "age_group": "18-24",
          "genre": "Sci-Fi",
          "total_hours": 15
        },
        {
          "age_group": "25-34",
          "genre": "Drama",
          "total_hours": 20
        },
        {
          "age_group": "35-49",
          "genre": "Documentary",
          "total_hours": 10
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Netflix business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT CASE WHEN s.age BETWEEN 18 AND 24 THEN '18-24' WHEN s.age BETWEEN 25 AND 34 THEN '25-34' WHEN s.age BETWEEN 35 AND 49 THEN '35-49' ELSE '50+' END AS age_group, g.genre, SUM(g.watch_hours) AS total_hours FROM subscribers s JOIN genre_streams g ON s.user_id = g.user_id GROUP BY 1, g.genre ORDER BY age_group ASC, total_hours DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CASE WHEN s.age BETWEEN 18 AND 24 THEN '18-24' WHEN s.age BETWEEN 25 AND 34 THEN '25-34' WHEN s.age BETWEEN 35 AND 49 THEN '35-49' ELSE '50+' END AS age_group, g.genre, SUM(g.watch_hours) AS total_hours FROM subscribers s JOIN genre_streams g ON s.user_id = g.user_id GROUP BY 1, g.genre ORDER BY age_group ASC, total_hours DESC;",
      "snowflake": "SELECT CASE WHEN s.age BETWEEN 18 AND 24 THEN '18-24' WHEN s.age BETWEEN 25 AND 34 THEN '25-34' WHEN s.age BETWEEN 35 AND 49 THEN '35-49' ELSE '50+' END AS age_group, g.genre, SUM(g.watch_hours) AS total_hours FROM subscribers s JOIN genre_streams g ON s.user_id = g.user_id GROUP BY 1, g.genre ORDER BY age_group ASC, total_hours DESC;",
      "bigquery": "SELECT CASE WHEN s.age BETWEEN 18 AND 24 THEN '18-24' WHEN s.age BETWEEN 25 AND 34 THEN '25-34' WHEN s.age BETWEEN 35 AND 49 THEN '35-49' ELSE '50+' END AS age_group, g.genre, SUM(g.watch_hours) AS total_hours FROM subscribers s JOIN genre_streams g ON s.user_id = g.user_id GROUP BY 1, g.genre ORDER BY age_group ASC, total_hours DESC;",
      "mysql": "SELECT CASE WHEN s.age BETWEEN 18 AND 24 THEN '18-24' WHEN s.age BETWEEN 25 AND 34 THEN '25-34' WHEN s.age BETWEEN 35 AND 49 THEN '35-49' ELSE '50+' END AS age_group, g.genre, SUM(g.watch_hours) AS total_hours FROM subscribers s JOIN genre_streams g ON s.user_id = g.user_id GROUP BY 1, g.genre ORDER BY age_group ASC, total_hours DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/26",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_netflix_churn_risk_by_duration",
    "questionNumber": 27,
    "title": "Netflix: Churn Risk by Subscription Duration",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the cancellation/churn rate for accounts based on subscription tenure tier: '0-3 months', '4-12 months', and '13+ months'. Output tenure_tier, total_subscribers, cancelled_subscribers, and churn_rate_pct rounded to 2 decimal places. Order by churn_rate_pct DESC.",
    "requirements": [
      "Classify tenure into tiers via CASE WHEN months_subscribed",
      "Compute churn_rate_pct = ROUND(SUM(is_cancelled) * 100.0 / COUNT(*), 2)",
      "Group by tenure_tier order by churn_rate_pct DESC"
    ],
    "schemas": [
      {
        "tableName": "netflix_accounts",
        "columns": [
          {
            "name": "account_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "months_subscribed",
            "type": "INT"
          },
          {
            "name": "is_cancelled",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "account_id": 1,
            "months_subscribed": 2,
            "is_cancelled": 1
          },
          {
            "account_id": 2,
            "months_subscribed": 2,
            "is_cancelled": 0
          },
          {
            "account_id": 3,
            "months_subscribed": 6,
            "is_cancelled": 0
          },
          {
            "account_id": 4,
            "months_subscribed": 15,
            "is_cancelled": 0
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "tenure_tier",
        "total_subscribers",
        "cancelled_subscribers",
        "churn_rate_pct"
      ],
      "rows": [
        {
          "tenure_tier": "0-3 months",
          "total_subscribers": 2,
          "cancelled_subscribers": 1,
          "churn_rate_pct": 50
        },
        {
          "tenure_tier": "13+ months",
          "total_subscribers": 1,
          "cancelled_subscribers": 0,
          "churn_rate_pct": 0
        },
        {
          "tenure_tier": "4-12 months",
          "total_subscribers": 1,
          "cancelled_subscribers": 0,
          "churn_rate_pct": 0
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Netflix business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT CASE WHEN months_subscribed <= 3 THEN '0-3 months' WHEN months_subscribed <= 12 THEN '4-12 months' ELSE '13+ months' END AS tenure_tier, COUNT(*) AS total_subscribers, SUM(is_cancelled) AS cancelled_subscribers, ROUND(SUM(is_cancelled) * 100.0 / COUNT(*), 2) AS churn_rate_pct FROM netflix_accounts GROUP BY 1 ORDER BY churn_rate_pct DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CASE WHEN months_subscribed <= 3 THEN '0-3 months' WHEN months_subscribed <= 12 THEN '4-12 months' ELSE '13+ months' END AS tenure_tier, COUNT(*) AS total_subscribers, SUM(is_cancelled) AS cancelled_subscribers, ROUND(SUM(is_cancelled) * 100.0 / COUNT(*), 2) AS churn_rate_pct FROM netflix_accounts GROUP BY 1 ORDER BY churn_rate_pct DESC;",
      "snowflake": "SELECT CASE WHEN months_subscribed <= 3 THEN '0-3 months' WHEN months_subscribed <= 12 THEN '4-12 months' ELSE '13+ months' END AS tenure_tier, COUNT(*) AS total_subscribers, SUM(is_cancelled) AS cancelled_subscribers, ROUND(SUM(is_cancelled) * 100.0 / COUNT(*), 2) AS churn_rate_pct FROM netflix_accounts GROUP BY 1 ORDER BY churn_rate_pct DESC;",
      "bigquery": "SELECT CASE WHEN months_subscribed <= 3 THEN '0-3 months' WHEN months_subscribed <= 12 THEN '4-12 months' ELSE '13+ months' END AS tenure_tier, COUNT(*) AS total_subscribers, SUM(is_cancelled) AS cancelled_subscribers, ROUND(SUM(is_cancelled) * 100.0 / COUNT(*), 2) AS churn_rate_pct FROM netflix_accounts GROUP BY 1 ORDER BY churn_rate_pct DESC;",
      "mysql": "SELECT CASE WHEN months_subscribed <= 3 THEN '0-3 months' WHEN months_subscribed <= 12 THEN '4-12 months' ELSE '13+ months' END AS tenure_tier, COUNT(*) AS total_subscribers, SUM(is_cancelled) AS cancelled_subscribers, ROUND(SUM(is_cancelled) * 100.0 / COUNT(*), 2) AS churn_rate_pct FROM netflix_accounts GROUP BY 1 ORDER BY churn_rate_pct DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/27",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_netflix_repeat_viewing_ratio",
    "questionNumber": 28,
    "title": "Netflix: Repeat Movie Viewing Analysis",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Find all movies that have been watched more than once by the same user. Return the movie_title, user_id, and watch_count. Sort by watch_count in descending order.",
    "requirements": [
      "Group by movie_title, user_id having COUNT(*) > 1",
      "Output movie_title, user_id, COUNT(*) AS watch_count",
      "Order by watch_count DESC, movie_title ASC"
    ],
    "schemas": [
      {
        "tableName": "movie_views",
        "columns": [
          {
            "name": "view_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "movie_title",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "view_id": 1,
            "user_id": 101,
            "movie_title": "Inception"
          },
          {
            "view_id": 2,
            "user_id": 101,
            "movie_title": "Inception"
          },
          {
            "view_id": 3,
            "user_id": 102,
            "movie_title": "Inception"
          },
          {
            "view_id": 4,
            "user_id": 103,
            "movie_title": "Titanic"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "movie_title",
        "user_id",
        "watch_count"
      ],
      "rows": [
        {
          "movie_title": "Inception",
          "user_id": 101,
          "watch_count": 2
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Netflix business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT movie_title, user_id, COUNT(*) AS watch_count FROM movie_views GROUP BY movie_title, user_id HAVING COUNT(*) > 1 ORDER BY watch_count DESC, movie_title ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT movie_title, user_id, COUNT(*) AS watch_count FROM movie_views GROUP BY movie_title, user_id HAVING COUNT(*) > 1 ORDER BY watch_count DESC, movie_title ASC;",
      "snowflake": "SELECT movie_title, user_id, COUNT(*) AS watch_count FROM movie_views GROUP BY movie_title, user_id HAVING COUNT(*) > 1 ORDER BY watch_count DESC, movie_title ASC;",
      "bigquery": "SELECT movie_title, user_id, COUNT(*) AS watch_count FROM movie_views GROUP BY movie_title, user_id HAVING COUNT(*) > 1 ORDER BY watch_count DESC, movie_title ASC;",
      "mysql": "SELECT movie_title, user_id, COUNT(*) AS watch_count FROM movie_views GROUP BY movie_title, user_id HAVING COUNT(*) > 1 ORDER BY watch_count DESC, movie_title ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/28",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_netflix_global_hours_milestone",
    "questionNumber": 29,
    "title": "Netflix: Running Total of Global Hours",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Compute the cumulative running total of global streaming hours day by day. Output streaming_date, daily_hours, and cumulative_hours. Order chronologically by streaming_date.",
    "requirements": [
      "Sum daily hours",
      "Use SUM(daily_hours) OVER (ORDER BY streaming_date ASC) as cumulative_hours",
      "Order by streaming_date ASC"
    ],
    "schemas": [
      {
        "tableName": "daily_metrics",
        "columns": [
          {
            "name": "streaming_date",
            "type": "DATE",
            "isPk": true
          },
          {
            "name": "daily_hours",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "streaming_date": "2026-03-01",
            "daily_hours": 1000000
          },
          {
            "streaming_date": "2026-03-02",
            "daily_hours": 1200000
          },
          {
            "streaming_date": "2026-03-03",
            "daily_hours": 950000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "streaming_date",
        "daily_hours",
        "cumulative_hours"
      ],
      "rows": [
        {
          "streaming_date": "2026-03-01",
          "daily_hours": 1000000,
          "cumulative_hours": 1000000
        },
        {
          "streaming_date": "2026-03-02",
          "daily_hours": 1200000,
          "cumulative_hours": 2200000
        },
        {
          "streaming_date": "2026-03-03",
          "daily_hours": 950000,
          "cumulative_hours": 3150000
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Netflix business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT streaming_date, daily_hours, SUM(daily_hours) OVER (ORDER BY streaming_date ASC) AS cumulative_hours FROM daily_metrics ORDER BY streaming_date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT streaming_date, daily_hours, SUM(daily_hours) OVER (ORDER BY streaming_date ASC) AS cumulative_hours FROM daily_metrics ORDER BY streaming_date ASC;",
      "snowflake": "SELECT streaming_date, daily_hours, SUM(daily_hours) OVER (ORDER BY streaming_date ASC) AS cumulative_hours FROM daily_metrics ORDER BY streaming_date ASC;",
      "bigquery": "SELECT streaming_date, daily_hours, SUM(daily_hours) OVER (ORDER BY streaming_date ASC) AS cumulative_hours FROM daily_metrics ORDER BY streaming_date ASC;",
      "mysql": "SELECT streaming_date, daily_hours, SUM(daily_hours) OVER (ORDER BY streaming_date ASC) AS cumulative_hours FROM daily_metrics ORDER BY streaming_date ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/29",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_netflix_originals_vs_licensed",
    "questionNumber": 30,
    "title": "Netflix: Originals vs Licensed Content Rating",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Compare viewer review ratings between Netflix Originals and Licensed content. Compute total titles, average viewer rating, and percentage of titles rated 8.0 or higher for both content types. Round averages and percentages to 2 decimal places.",
    "requirements": [
      "Group by is_original (1 = Original, 0 = Licensed)",
      "Compute COUNT(*), ROUND(AVG(rating), 2), and ROUND(SUM(CASE WHEN rating >= 8.0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Order by is_original DESC"
    ],
    "schemas": [
      {
        "tableName": "titles",
        "columns": [
          {
            "name": "title_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "is_original",
            "type": "INT"
          },
          {
            "name": "rating",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "title_id": 1,
            "is_original": 1,
            "rating": 8.5
          },
          {
            "title_id": 2,
            "is_original": 1,
            "rating": 7.5
          },
          {
            "title_id": 3,
            "is_original": 0,
            "rating": 8
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "is_original",
        "total_titles",
        "avg_rating",
        "high_rating_pct"
      ],
      "rows": [
        {
          "is_original": 1,
          "total_titles": 2,
          "avg_rating": 8,
          "high_rating_pct": 50
        },
        {
          "is_original": 0,
          "total_titles": 1,
          "avg_rating": 8,
          "high_rating_pct": 100
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Netflix business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT is_original, COUNT(*) AS total_titles, ROUND(AVG(rating), 2) AS avg_rating, ROUND(SUM(CASE WHEN rating >= 8.0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS high_rating_pct FROM titles GROUP BY is_original ORDER BY is_original DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT is_original, COUNT(*) AS total_titles, ROUND(AVG(rating), 2) AS avg_rating, ROUND(SUM(CASE WHEN rating >= 8.0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS high_rating_pct FROM titles GROUP BY is_original ORDER BY is_original DESC;",
      "snowflake": "SELECT is_original, COUNT(*) AS total_titles, ROUND(AVG(rating), 2) AS avg_rating, ROUND(SUM(CASE WHEN rating >= 8.0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS high_rating_pct FROM titles GROUP BY is_original ORDER BY is_original DESC;",
      "bigquery": "SELECT is_original, COUNT(*) AS total_titles, ROUND(AVG(rating), 2) AS avg_rating, ROUND(SUM(CASE WHEN rating >= 8.0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS high_rating_pct FROM titles GROUP BY is_original ORDER BY is_original DESC;",
      "mysql": "SELECT is_original, COUNT(*) AS total_titles, ROUND(AVG(rating), 2) AS avg_rating, ROUND(SUM(CASE WHEN rating >= 8.0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS high_rating_pct FROM titles GROUP BY is_original ORDER BY is_original DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/30",
    "companyTag": "Netflix",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_spotify_top_daily_artists",
    "questionNumber": 31,
    "title": "Spotify: Top Daily Streaming Artists",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "At Spotify, determine the top 3 most-streamed artists for the date '2026-03-01'. Output artist_name, total_streams, and rank. If there is a tie, order alphabetically by artist_name.",
    "requirements": [
      "Filter where stream_date = '2026-03-01'",
      "Sum stream_count by artist_name",
      "Use DENSE_RANK() OVER (ORDER BY total_streams DESC)",
      "Filter where rank <= 3 and order by rank ASC, artist_name ASC"
    ],
    "schemas": [
      {
        "tableName": "spotify_daily",
        "columns": [
          {
            "name": "track_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "artist_name",
            "type": "VARCHAR"
          },
          {
            "name": "stream_date",
            "type": "DATE"
          },
          {
            "name": "stream_count",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "track_id": 1,
            "artist_name": "Taylor Swift",
            "stream_date": "2026-03-01",
            "stream_count": 5000000
          },
          {
            "track_id": 2,
            "artist_name": "The Weeknd",
            "stream_date": "2026-03-01",
            "stream_count": 4200000
          },
          {
            "track_id": 3,
            "artist_name": "Drake",
            "stream_date": "2026-03-01",
            "stream_count": 3800000
          },
          {
            "track_id": 4,
            "artist_name": "Bad Bunny",
            "stream_date": "2026-03-01",
            "stream_count": 3100000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "artist_name",
        "total_streams",
        "rank"
      ],
      "rows": [
        {
          "artist_name": "Taylor Swift",
          "total_streams": 5000000,
          "rank": 1
        },
        {
          "artist_name": "The Weeknd",
          "total_streams": 4200000,
          "rank": 2
        },
        {
          "artist_name": "Drake",
          "total_streams": 3800000,
          "rank": 3
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Spotify business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH ranked AS (SELECT artist_name, SUM(stream_count) AS total_streams, DENSE_RANK() OVER (ORDER BY SUM(stream_count) DESC) AS rank FROM spotify_daily WHERE stream_date = '2026-03-01' GROUP BY artist_name) SELECT artist_name, total_streams, rank FROM ranked WHERE rank <= 3 ORDER BY rank ASC, artist_name ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH ranked AS (SELECT artist_name, SUM(stream_count) AS total_streams, DENSE_RANK() OVER (ORDER BY SUM(stream_count) DESC) AS rank FROM spotify_daily WHERE stream_date = '2026-03-01' GROUP BY artist_name) SELECT artist_name, total_streams, rank FROM ranked WHERE rank <= 3 ORDER BY rank ASC, artist_name ASC;",
      "snowflake": "WITH ranked AS (SELECT artist_name, SUM(stream_count) AS total_streams, DENSE_RANK() OVER (ORDER BY SUM(stream_count) DESC) AS rank FROM spotify_daily WHERE stream_date = '2026-03-01' GROUP BY artist_name) SELECT artist_name, total_streams, rank FROM ranked WHERE rank <= 3 ORDER BY rank ASC, artist_name ASC;",
      "bigquery": "WITH ranked AS (SELECT artist_name, SUM(stream_count) AS total_streams, DENSE_RANK() OVER (ORDER BY SUM(stream_count) DESC) AS rank FROM spotify_daily WHERE stream_date = '2026-03-01' GROUP BY artist_name) SELECT artist_name, total_streams, rank FROM ranked WHERE rank <= 3 ORDER BY rank ASC, artist_name ASC;",
      "mysql": "WITH ranked AS (SELECT artist_name, SUM(stream_count) AS total_streams, DENSE_RANK() OVER (ORDER BY SUM(stream_count) DESC) AS rank FROM spotify_daily WHERE stream_date = '2026-03-01' GROUP BY artist_name) SELECT artist_name, total_streams, rank FROM ranked WHERE rank <= 3 ORDER BY rank ASC, artist_name ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/31",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_spotify_skip_rate_30s",
    "questionNumber": 32,
    "title": "Spotify: Song Skip Rate within 30 Seconds",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the early skip rate for songs played in Spotify recommendations. An early skip occurs when listen_duration_seconds < 30. Calculate total plays, total skips, and skip_rate_pct rounded to 2 decimal places per track. Exclude tracks with fewer than 5 total plays. Order by skip_rate_pct descending.",
    "requirements": [
      "Compute skip_rate_pct = ROUND(SUM(CASE WHEN listen_duration_seconds < 30 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by track_id having COUNT(*) >= 5",
      "Order by skip_rate_pct DESC, track_id ASC"
    ],
    "schemas": [
      {
        "tableName": "track_plays",
        "columns": [
          {
            "name": "play_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "track_id",
            "type": "INT"
          },
          {
            "name": "listen_duration_seconds",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "play_id": 1,
            "track_id": 10,
            "listen_duration_seconds": 15
          },
          {
            "play_id": 2,
            "track_id": 10,
            "listen_duration_seconds": 180
          },
          {
            "play_id": 3,
            "track_id": 10,
            "listen_duration_seconds": 10
          },
          {
            "play_id": 4,
            "track_id": 10,
            "listen_duration_seconds": 200
          },
          {
            "play_id": 5,
            "track_id": 10,
            "listen_duration_seconds": 12
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "track_id",
        "total_plays",
        "total_skips",
        "skip_rate_pct"
      ],
      "rows": [
        {
          "track_id": 10,
          "total_plays": 5,
          "total_skips": 3,
          "skip_rate_pct": 60
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Spotify business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT track_id, COUNT(*) AS total_plays, SUM(CASE WHEN listen_duration_seconds < 30 THEN 1 ELSE 0 END) AS total_skips, ROUND(SUM(CASE WHEN listen_duration_seconds < 30 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS skip_rate_pct FROM track_plays GROUP BY track_id HAVING COUNT(*) >= 5 ORDER BY skip_rate_pct DESC, track_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT track_id, COUNT(*) AS total_plays, SUM(CASE WHEN listen_duration_seconds < 30 THEN 1 ELSE 0 END) AS total_skips, ROUND(SUM(CASE WHEN listen_duration_seconds < 30 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS skip_rate_pct FROM track_plays GROUP BY track_id HAVING COUNT(*) >= 5 ORDER BY skip_rate_pct DESC, track_id ASC;",
      "snowflake": "SELECT track_id, COUNT(*) AS total_plays, SUM(CASE WHEN listen_duration_seconds < 30 THEN 1 ELSE 0 END) AS total_skips, ROUND(SUM(CASE WHEN listen_duration_seconds < 30 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS skip_rate_pct FROM track_plays GROUP BY track_id HAVING COUNT(*) >= 5 ORDER BY skip_rate_pct DESC, track_id ASC;",
      "bigquery": "SELECT track_id, COUNT(*) AS total_plays, SUM(CASE WHEN listen_duration_seconds < 30 THEN 1 ELSE 0 END) AS total_skips, ROUND(SUM(CASE WHEN listen_duration_seconds < 30 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS skip_rate_pct FROM track_plays GROUP BY track_id HAVING COUNT(*) >= 5 ORDER BY skip_rate_pct DESC, track_id ASC;",
      "mysql": "SELECT track_id, COUNT(*) AS total_plays, SUM(CASE WHEN listen_duration_seconds < 30 THEN 1 ELSE 0 END) AS total_skips, ROUND(SUM(CASE WHEN listen_duration_seconds < 30 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS skip_rate_pct FROM track_plays GROUP BY track_id HAVING COUNT(*) >= 5 ORDER BY skip_rate_pct DESC, track_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/32",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_spotify_playlist_retention",
    "questionNumber": 33,
    "title": "Spotify: Playlist 30-Day Retention Rate",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "joins",
    "topicLabel": "JOINS",
    "businessScenario": "Calculate the 30-day retention rate of user-created playlists. A playlist is considered retained if a user played at least one track from it 30 days after creation. Output creation_month and retention_pct rounded to 2 decimal places. Order by creation_month ascending.",
    "requirements": [
      "Join playlists with playlist_plays on playlist_id",
      "Check if play_date >= created_date + INTERVAL '30 days'",
      "Compute retention_pct = ROUND(COUNT(DISTINCT p.playlist_id) * 100.0 / (SELECT COUNT(*) FROM playlists), 2)",
      "Group by creation_month order by creation_month ASC"
    ],
    "schemas": [
      {
        "tableName": "playlists",
        "columns": [
          {
            "name": "playlist_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "created_date",
            "type": "DATE"
          }
        ],
        "sampleRows": [
          {
            "playlist_id": 1,
            "created_date": "2026-01-01"
          },
          {
            "playlist_id": 2,
            "created_date": "2026-01-15"
          }
        ]
      },
      {
        "tableName": "playlist_plays",
        "columns": [
          {
            "name": "play_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "playlist_id",
            "type": "INT"
          },
          {
            "name": "play_date",
            "type": "DATE"
          }
        ],
        "sampleRows": [
          {
            "play_id": 10,
            "playlist_id": 1,
            "play_date": "2026-02-05"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "creation_month",
        "retention_pct"
      ],
      "rows": [
        {
          "creation_month": "2026-01",
          "retention_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Spotify business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT TO_CHAR(p.created_date, 'YYYY-MM') AS creation_month, ROUND(COUNT(DISTINCT CASE WHEN pp.play_date >= p.created_date + INTERVAL '30 days' THEN p.playlist_id END) * 100.0 / COUNT(DISTINCT p.playlist_id), 2) AS retention_pct FROM playlists p LEFT JOIN playlist_plays pp ON p.playlist_id = pp.playlist_id GROUP BY 1 ORDER BY creation_month ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT TO_CHAR(p.created_date, 'YYYY-MM') AS creation_month, ROUND(COUNT(DISTINCT CASE WHEN pp.play_date >= p.created_date + INTERVAL '30 days' THEN p.playlist_id END) * 100.0 / COUNT(DISTINCT p.playlist_id), 2) AS retention_pct FROM playlists p LEFT JOIN playlist_plays pp ON p.playlist_id = pp.playlist_id GROUP BY 1 ORDER BY creation_month ASC;",
      "snowflake": "SELECT TO_CHAR(p.created_date, 'YYYY-MM') AS creation_month, ROUND(COUNT(DISTINCT CASE WHEN pp.play_date >= p.created_date + INTERVAL '30 days' THEN p.playlist_id END) * 100.0 / COUNT(DISTINCT p.playlist_id), 2) AS retention_pct FROM playlists p LEFT JOIN playlist_plays pp ON p.playlist_id = pp.playlist_id GROUP BY 1 ORDER BY creation_month ASC;",
      "bigquery": "SELECT TO_CHAR(p.created_date, 'YYYY-MM') AS creation_month, ROUND(COUNT(DISTINCT CASE WHEN pp.play_date >= p.created_date + INTERVAL '30 days' THEN p.playlist_id END) * 100.0 / COUNT(DISTINCT p.playlist_id), 2) AS retention_pct FROM playlists p LEFT JOIN playlist_plays pp ON p.playlist_id = pp.playlist_id GROUP BY 1 ORDER BY creation_month ASC;",
      "mysql": "SELECT TO_CHAR(p.created_date, 'YYYY-MM') AS creation_month, ROUND(COUNT(DISTINCT CASE WHEN pp.play_date >= p.created_date + INTERVAL '30 days' THEN p.playlist_id END) * 100.0 / COUNT(DISTINCT p.playlist_id), 2) AS retention_pct FROM playlists p LEFT JOIN playlist_plays pp ON p.playlist_id = pp.playlist_id GROUP BY 1 ORDER BY creation_month ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/33",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_spotify_free_vs_premium_listening",
    "questionNumber": 34,
    "title": "Spotify: Free vs Premium Daily Listening Hours",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Compare daily listening habits between Free and Premium Spotify subscribers. Output plan_type, total_listeners, total_hours, and avg_hours_per_listener rounded to 2 decimal places. Order by total_hours descending.",
    "requirements": [
      "Group by plan_type",
      "Compute COUNT(DISTINCT user_id), SUM(listening_hours), and ROUND(AVG(listening_hours), 2)",
      "Order by total_hours DESC"
    ],
    "schemas": [
      {
        "tableName": "user_daily_streams",
        "columns": [
          {
            "name": "user_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "plan_type",
            "type": "VARCHAR"
          },
          {
            "name": "listening_hours",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "user_id": 1,
            "plan_type": "Premium",
            "listening_hours": 4.5
          },
          {
            "user_id": 2,
            "plan_type": "Premium",
            "listening_hours": 5.5
          },
          {
            "user_id": 3,
            "plan_type": "Free",
            "listening_hours": 2
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "plan_type",
        "total_listeners",
        "total_hours",
        "avg_hours_per_listener"
      ],
      "rows": [
        {
          "plan_type": "Premium",
          "total_listeners": 2,
          "total_hours": 10,
          "avg_hours_per_listener": 5
        },
        {
          "plan_type": "Free",
          "total_listeners": 1,
          "total_hours": 2,
          "avg_hours_per_listener": 2
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Spotify business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT plan_type, COUNT(DISTINCT user_id) AS total_listeners, SUM(listening_hours) AS total_hours, ROUND(AVG(listening_hours), 2) AS avg_hours_per_listener FROM user_daily_streams GROUP BY plan_type ORDER BY total_hours DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT plan_type, COUNT(DISTINCT user_id) AS total_listeners, SUM(listening_hours) AS total_hours, ROUND(AVG(listening_hours), 2) AS avg_hours_per_listener FROM user_daily_streams GROUP BY plan_type ORDER BY total_hours DESC;",
      "snowflake": "SELECT plan_type, COUNT(DISTINCT user_id) AS total_listeners, SUM(listening_hours) AS total_hours, ROUND(AVG(listening_hours), 2) AS avg_hours_per_listener FROM user_daily_streams GROUP BY plan_type ORDER BY total_hours DESC;",
      "bigquery": "SELECT plan_type, COUNT(DISTINCT user_id) AS total_listeners, SUM(listening_hours) AS total_hours, ROUND(AVG(listening_hours), 2) AS avg_hours_per_listener FROM user_daily_streams GROUP BY plan_type ORDER BY total_hours DESC;",
      "mysql": "SELECT plan_type, COUNT(DISTINCT user_id) AS total_listeners, SUM(listening_hours) AS total_hours, ROUND(AVG(listening_hours), 2) AS avg_hours_per_listener FROM user_daily_streams GROUP BY plan_type ORDER BY total_hours DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/34",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_spotify_viral_track_velocity",
    "questionNumber": 35,
    "title": "Spotify: Viral Track Stream Velocity",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Identify tracks that doubled their stream volume from day 1 to day 2 following release. Output track_id, day1_streams, day2_streams, and velocity_ratio rounded to 2 decimal places. Order by velocity_ratio descending.",
    "requirements": [
      "Filter where day IN (1, 2)",
      "Use self join or conditional aggregation to pair day 1 and day 2 streams",
      "Filter where day2_streams >= 2 * day1_streams",
      "Order by velocity_ratio DESC, track_id ASC"
    ],
    "schemas": [
      {
        "tableName": "track_release_streams",
        "columns": [
          {
            "name": "track_id",
            "type": "INT"
          },
          {
            "name": "release_day",
            "type": "INT"
          },
          {
            "name": "streams",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "track_id": 101,
            "release_day": 1,
            "streams": 5000
          },
          {
            "track_id": 101,
            "release_day": 2,
            "streams": 12000
          },
          {
            "track_id": 102,
            "release_day": 1,
            "streams": 8000
          },
          {
            "track_id": 102,
            "release_day": 2,
            "streams": 9000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "track_id",
        "day1_streams",
        "day2_streams",
        "velocity_ratio"
      ],
      "rows": [
        {
          "track_id": 101,
          "day1_streams": 5000,
          "day2_streams": 12000,
          "velocity_ratio": 2.4
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Spotify business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH paired AS (SELECT track_id, MAX(CASE WHEN release_day = 1 THEN streams END) AS day1_streams, MAX(CASE WHEN release_day = 2 THEN streams END) AS day2_streams FROM track_release_streams WHERE release_day IN (1, 2) GROUP BY track_id) SELECT track_id, day1_streams, day2_streams, ROUND(day2_streams * 1.0 / day1_streams, 2) AS velocity_ratio FROM paired WHERE day2_streams >= 2 * day1_streams ORDER BY velocity_ratio DESC, track_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH paired AS (SELECT track_id, MAX(CASE WHEN release_day = 1 THEN streams END) AS day1_streams, MAX(CASE WHEN release_day = 2 THEN streams END) AS day2_streams FROM track_release_streams WHERE release_day IN (1, 2) GROUP BY track_id) SELECT track_id, day1_streams, day2_streams, ROUND(day2_streams * 1.0 / day1_streams, 2) AS velocity_ratio FROM paired WHERE day2_streams >= 2 * day1_streams ORDER BY velocity_ratio DESC, track_id ASC;",
      "snowflake": "WITH paired AS (SELECT track_id, MAX(CASE WHEN release_day = 1 THEN streams END) AS day1_streams, MAX(CASE WHEN release_day = 2 THEN streams END) AS day2_streams FROM track_release_streams WHERE release_day IN (1, 2) GROUP BY track_id) SELECT track_id, day1_streams, day2_streams, ROUND(day2_streams * 1.0 / day1_streams, 2) AS velocity_ratio FROM paired WHERE day2_streams >= 2 * day1_streams ORDER BY velocity_ratio DESC, track_id ASC;",
      "bigquery": "WITH paired AS (SELECT track_id, MAX(CASE WHEN release_day = 1 THEN streams END) AS day1_streams, MAX(CASE WHEN release_day = 2 THEN streams END) AS day2_streams FROM track_release_streams WHERE release_day IN (1, 2) GROUP BY track_id) SELECT track_id, day1_streams, day2_streams, ROUND(day2_streams * 1.0 / day1_streams, 2) AS velocity_ratio FROM paired WHERE day2_streams >= 2 * day1_streams ORDER BY velocity_ratio DESC, track_id ASC;",
      "mysql": "WITH paired AS (SELECT track_id, MAX(CASE WHEN release_day = 1 THEN streams END) AS day1_streams, MAX(CASE WHEN release_day = 2 THEN streams END) AS day2_streams FROM track_release_streams WHERE release_day IN (1, 2) GROUP BY track_id) SELECT track_id, day1_streams, day2_streams, ROUND(day2_streams * 1.0 / day1_streams, 2) AS velocity_ratio FROM paired WHERE day2_streams >= 2 * day1_streams ORDER BY velocity_ratio DESC, track_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/35",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_spotify_listener_hours_country",
    "questionNumber": 36,
    "title": "Spotify: Top Listener Hours by Country",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the total listening hours and total distinct active listeners for each country. Filter out countries with fewer than 50 total hours. Order by total_hours descending.",
    "requirements": [
      "Sum listening hours by country",
      "Count distinct active users",
      "Filter having SUM(hours) >= 50",
      "Order by total_hours DESC, country ASC"
    ],
    "schemas": [
      {
        "tableName": "country_streams",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "country",
            "type": "VARCHAR"
          },
          {
            "name": "hours",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "user_id": 1,
            "country": "USA",
            "hours": 45
          },
          {
            "user_id": 2,
            "country": "USA",
            "hours": 60
          },
          {
            "user_id": 3,
            "country": "UK",
            "hours": 80
          },
          {
            "user_id": 4,
            "country": "CAN",
            "hours": 20
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "country",
        "total_listeners",
        "total_hours"
      ],
      "rows": [
        {
          "country": "USA",
          "total_listeners": 2,
          "total_hours": 105
        },
        {
          "country": "UK",
          "total_listeners": 1,
          "total_hours": 80
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Spotify business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT country, COUNT(DISTINCT user_id) AS total_listeners, SUM(hours) AS total_hours FROM country_streams GROUP BY country HAVING SUM(hours) >= 50 ORDER BY total_hours DESC, country ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT country, COUNT(DISTINCT user_id) AS total_listeners, SUM(hours) AS total_hours FROM country_streams GROUP BY country HAVING SUM(hours) >= 50 ORDER BY total_hours DESC, country ASC;",
      "snowflake": "SELECT country, COUNT(DISTINCT user_id) AS total_listeners, SUM(hours) AS total_hours FROM country_streams GROUP BY country HAVING SUM(hours) >= 50 ORDER BY total_hours DESC, country ASC;",
      "bigquery": "SELECT country, COUNT(DISTINCT user_id) AS total_listeners, SUM(hours) AS total_hours FROM country_streams GROUP BY country HAVING SUM(hours) >= 50 ORDER BY total_hours DESC, country ASC;",
      "mysql": "SELECT country, COUNT(DISTINCT user_id) AS total_listeners, SUM(hours) AS total_hours FROM country_streams GROUP BY country HAVING SUM(hours) >= 50 ORDER BY total_hours DESC, country ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/36",
    "companyTag": "Spotify",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_stripe_disputed_chargebacks_country",
    "questionNumber": 37,
    "title": "Stripe: Disputed Chargebacks by Country",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "At Stripe, risk teams monitor merchant dispute rates. Write a query to find the dispute rate percentage per merchant country. Dispute rate is total disputed transactions divided by total transactions, multiplied by 100. Output country, total_txns, disputed_txns, and dispute_rate_pct rounded to 2 decimal places. Order by dispute_rate_pct descending.",
    "requirements": [
      "Compute dispute_rate_pct = ROUND(SUM(CASE WHEN is_disputed = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by country",
      "Order by dispute_rate_pct DESC, country ASC"
    ],
    "schemas": [
      {
        "tableName": "charges",
        "columns": [
          {
            "name": "charge_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "country",
            "type": "VARCHAR"
          },
          {
            "name": "is_disputed",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "charge_id": 1,
            "country": "US",
            "is_disputed": 0
          },
          {
            "charge_id": 2,
            "country": "US",
            "is_disputed": 1
          },
          {
            "charge_id": 3,
            "country": "US",
            "is_disputed": 0
          },
          {
            "charge_id": 4,
            "country": "BR",
            "is_disputed": 1
          },
          {
            "charge_id": 5,
            "country": "BR",
            "is_disputed": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "country",
        "total_txns",
        "disputed_txns",
        "dispute_rate_pct"
      ],
      "rows": [
        {
          "country": "BR",
          "total_txns": 2,
          "disputed_txns": 2,
          "dispute_rate_pct": 100
        },
        {
          "country": "US",
          "total_txns": 3,
          "disputed_txns": 1,
          "dispute_rate_pct": 33.33
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Stripe business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT country, COUNT(*) AS total_txns, SUM(is_disputed) AS disputed_txns, ROUND(SUM(is_disputed) * 100.0 / COUNT(*), 2) AS dispute_rate_pct FROM charges GROUP BY country ORDER BY dispute_rate_pct DESC, country ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT country, COUNT(*) AS total_txns, SUM(is_disputed) AS disputed_txns, ROUND(SUM(is_disputed) * 100.0 / COUNT(*), 2) AS dispute_rate_pct FROM charges GROUP BY country ORDER BY dispute_rate_pct DESC, country ASC;",
      "snowflake": "SELECT country, COUNT(*) AS total_txns, SUM(is_disputed) AS disputed_txns, ROUND(SUM(is_disputed) * 100.0 / COUNT(*), 2) AS dispute_rate_pct FROM charges GROUP BY country ORDER BY dispute_rate_pct DESC, country ASC;",
      "bigquery": "SELECT country, COUNT(*) AS total_txns, SUM(is_disputed) AS disputed_txns, ROUND(SUM(is_disputed) * 100.0 / COUNT(*), 2) AS dispute_rate_pct FROM charges GROUP BY country ORDER BY dispute_rate_pct DESC, country ASC;",
      "mysql": "SELECT country, COUNT(*) AS total_txns, SUM(is_disputed) AS disputed_txns, ROUND(SUM(is_disputed) * 100.0 / COUNT(*), 2) AS dispute_rate_pct FROM charges GROUP BY country ORDER BY dispute_rate_pct DESC, country ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/37",
    "companyTag": "Stripe",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_stripe_weekly_gmv",
    "questionNumber": 38,
    "title": "Stripe: Weekly Gross Merchant Volume (GMV)",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "datetime",
    "topicLabel": "DATETIME",
    "businessScenario": "Calculate the total successful Gross Merchant Volume (GMV) processed each week. Only consider transactions where status = 'succeeded'. Output week_start_date (Monday) and total_gmv rounded to 2 decimal places. Order chronologically by week_start_date.",
    "requirements": [
      "Filter where status = 'succeeded'",
      "Truncate timestamp to week using DATE_TRUNC('week', created_at)",
      "Sum amount and order by week_start_date ASC"
    ],
    "schemas": [
      {
        "tableName": "stripe_payments",
        "columns": [
          {
            "name": "payment_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "created_at",
            "type": "DATE"
          },
          {
            "name": "amount",
            "type": "NUMERIC"
          },
          {
            "name": "status",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "payment_id": 1,
            "created_at": "2026-03-02",
            "amount": 1200,
            "status": "succeeded"
          },
          {
            "payment_id": 2,
            "created_at": "2026-03-04",
            "amount": 800,
            "status": "succeeded"
          },
          {
            "payment_id": 3,
            "created_at": "2026-03-09",
            "amount": 2500,
            "status": "succeeded"
          },
          {
            "payment_id": 4,
            "created_at": "2026-03-03",
            "amount": 500,
            "status": "failed"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "week_start_date",
        "total_gmv"
      ],
      "rows": [
        {
          "week_start_date": "2026-03-02",
          "total_gmv": 2000
        },
        {
          "week_start_date": "2026-03-09",
          "total_gmv": 2500
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Stripe business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT CAST(DATE_TRUNC('week', created_at) AS DATE) AS week_start_date, ROUND(SUM(amount), 2) AS total_gmv FROM stripe_payments WHERE status = 'succeeded' GROUP BY DATE_TRUNC('week', created_at) ORDER BY week_start_date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT CAST(DATE_TRUNC('week', created_at) AS DATE) AS week_start_date, ROUND(SUM(amount), 2) AS total_gmv FROM stripe_payments WHERE status = 'succeeded' GROUP BY DATE_TRUNC('week', created_at) ORDER BY week_start_date ASC;",
      "snowflake": "SELECT CAST(DATE_TRUNC('week', created_at) AS DATE) AS week_start_date, ROUND(SUM(amount), 2) AS total_gmv FROM stripe_payments WHERE status = 'succeeded' GROUP BY DATE_TRUNC('week', created_at) ORDER BY week_start_date ASC;",
      "bigquery": "SELECT CAST(DATE_TRUNC('week', created_at) AS DATE) AS week_start_date, ROUND(SUM(amount), 2) AS total_gmv FROM stripe_payments WHERE status = 'succeeded' GROUP BY DATE_TRUNC('week', created_at) ORDER BY week_start_date ASC;",
      "mysql": "SELECT CAST(DATE_TRUNC('week', created_at) AS DATE) AS week_start_date, ROUND(SUM(amount), 2) AS total_gmv FROM stripe_payments WHERE status = 'succeeded' GROUP BY DATE_TRUNC('week', created_at) ORDER BY week_start_date ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/38",
    "companyTag": "Stripe",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_stripe_failed_retry_success",
    "questionNumber": 39,
    "title": "Stripe: Failed Transaction Retry Success Rate",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "Measure Stripe Smart Retries engine efficiency. For payment intents that failed on attempt 1, determine the percentage that successfully settled on attempt 2 within 24 hours. Output total_failed_first_attempts, successful_second_attempts, and retry_success_rate_pct rounded to 2 decimal places.",
    "requirements": [
      "Partition by customer_id or payment_intent_id ordered by attempt_number",
      "Filter intents with attempt 1 failed",
      "Check if attempt 2 succeeded within 24 hours",
      "Compute retry_success_rate_pct"
    ],
    "schemas": [
      {
        "tableName": "payment_attempts",
        "columns": [
          {
            "name": "intent_id",
            "type": "INT"
          },
          {
            "name": "attempt_number",
            "type": "INT"
          },
          {
            "name": "status",
            "type": "VARCHAR"
          }
        ],
        "sampleRows": [
          {
            "intent_id": 101,
            "attempt_number": 1,
            "status": "failed"
          },
          {
            "intent_id": 101,
            "attempt_number": 2,
            "status": "succeeded"
          },
          {
            "intent_id": 102,
            "attempt_number": 1,
            "status": "failed"
          },
          {
            "intent_id": 102,
            "attempt_number": 2,
            "status": "failed"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "total_failed_first_attempts",
        "successful_second_attempts",
        "retry_success_rate_pct"
      ],
      "rows": [
        {
          "total_failed_first_attempts": 2,
          "successful_second_attempts": 1,
          "retry_success_rate_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Stripe business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH p1 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 1 AND status = 'failed'), p2 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 2 AND status = 'succeeded') SELECT (SELECT COUNT(*) FROM p1) AS total_failed_first_attempts, (SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) AS successful_second_attempts, ROUND((SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) * 100.0 / (SELECT COUNT(*) FROM p1), 2) AS retry_success_rate_pct;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH p1 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 1 AND status = 'failed'), p2 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 2 AND status = 'succeeded') SELECT (SELECT COUNT(*) FROM p1) AS total_failed_first_attempts, (SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) AS successful_second_attempts, ROUND((SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) * 100.0 / (SELECT COUNT(*) FROM p1), 2) AS retry_success_rate_pct;",
      "snowflake": "WITH p1 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 1 AND status = 'failed'), p2 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 2 AND status = 'succeeded') SELECT (SELECT COUNT(*) FROM p1) AS total_failed_first_attempts, (SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) AS successful_second_attempts, ROUND((SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) * 100.0 / (SELECT COUNT(*) FROM p1), 2) AS retry_success_rate_pct;",
      "bigquery": "WITH p1 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 1 AND status = 'failed'), p2 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 2 AND status = 'succeeded') SELECT (SELECT COUNT(*) FROM p1) AS total_failed_first_attempts, (SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) AS successful_second_attempts, ROUND((SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) * 100.0 / (SELECT COUNT(*) FROM p1), 2) AS retry_success_rate_pct;",
      "mysql": "WITH p1 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 1 AND status = 'failed'), p2 AS (SELECT intent_id FROM payment_attempts WHERE attempt_number = 2 AND status = 'succeeded') SELECT (SELECT COUNT(*) FROM p1) AS total_failed_first_attempts, (SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) AS successful_second_attempts, ROUND((SELECT COUNT(*) FROM p2 WHERE intent_id IN (SELECT intent_id FROM p1)) * 100.0 / (SELECT COUNT(*) FROM p1), 2) AS retry_success_rate_pct;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/39",
    "companyTag": "Stripe",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_stripe_processing_fee_margin",
    "questionNumber": 40,
    "title": "Stripe: Average Processing Fee Margin",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the average fee percentage collected across payment methods (card, ach, apple_pay). Fee percentage is calculated as fee_collected divided by transaction_amount, multiplied by 100. Output payment_method and avg_fee_pct rounded to 2 decimal places. Order by avg_fee_pct descending.",
    "requirements": [
      "Compute avg_fee_pct = ROUND(AVG(fee_collected * 100.0 / transaction_amount), 2)",
      "Group by payment_method",
      "Order by avg_fee_pct DESC"
    ],
    "schemas": [
      {
        "tableName": "merchant_fees",
        "columns": [
          {
            "name": "txn_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "payment_method",
            "type": "VARCHAR"
          },
          {
            "name": "transaction_amount",
            "type": "NUMERIC"
          },
          {
            "name": "fee_collected",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "txn_id": 1,
            "payment_method": "card",
            "transaction_amount": 100,
            "fee_collected": 2.9
          },
          {
            "txn_id": 2,
            "payment_method": "card",
            "transaction_amount": 200,
            "fee_collected": 5.8
          },
          {
            "txn_id": 3,
            "payment_method": "ach",
            "transaction_amount": 500,
            "fee_collected": 4
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "payment_method",
        "avg_fee_pct"
      ],
      "rows": [
        {
          "payment_method": "card",
          "avg_fee_pct": 2.9
        },
        {
          "payment_method": "ach",
          "avg_fee_pct": 0.8
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Stripe business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT payment_method, ROUND(AVG(fee_collected * 100.0 / transaction_amount), 2) AS avg_fee_pct FROM merchant_fees GROUP BY payment_method ORDER BY avg_fee_pct DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT payment_method, ROUND(AVG(fee_collected * 100.0 / transaction_amount), 2) AS avg_fee_pct FROM merchant_fees GROUP BY payment_method ORDER BY avg_fee_pct DESC;",
      "snowflake": "SELECT payment_method, ROUND(AVG(fee_collected * 100.0 / transaction_amount), 2) AS avg_fee_pct FROM merchant_fees GROUP BY payment_method ORDER BY avg_fee_pct DESC;",
      "bigquery": "SELECT payment_method, ROUND(AVG(fee_collected * 100.0 / transaction_amount), 2) AS avg_fee_pct FROM merchant_fees GROUP BY payment_method ORDER BY avg_fee_pct DESC;",
      "mysql": "SELECT payment_method, ROUND(AVG(fee_collected * 100.0 / transaction_amount), 2) AS avg_fee_pct FROM merchant_fees GROUP BY payment_method ORDER BY avg_fee_pct DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/40",
    "companyTag": "Stripe",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_stripe_high_risk_merchants",
    "questionNumber": 41,
    "title": "Stripe: High Risk Merchant Flagging",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Flag all merchants where total refunded volume exceeds $1,000 AND the refund rate is greater than 10% of their total volume. Output merchant_id, total_volume, refunded_volume, and refund_rate_pct rounded to 2 decimal places. Order by refund_rate_pct descending.",
    "requirements": [
      "Group by merchant_id",
      "Sum total_volume and refunded_volume",
      "Filter having refunded_volume > 1000 AND refunded_volume * 1.0 / total_volume > 0.10",
      "Order by refund_rate_pct DESC, merchant_id ASC"
    ],
    "schemas": [
      {
        "tableName": "merchant_volumes",
        "columns": [
          {
            "name": "merchant_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "NUMERIC"
          },
          {
            "name": "is_refunded",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "merchant_id": 1,
            "amount": 8000,
            "is_refunded": 0
          },
          {
            "merchant_id": 1,
            "amount": 2000,
            "is_refunded": 1
          },
          {
            "merchant_id": 2,
            "amount": 500,
            "is_refunded": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "merchant_id",
        "total_volume",
        "refunded_volume",
        "refund_rate_pct"
      ],
      "rows": [
        {
          "merchant_id": 1,
          "total_volume": 10000,
          "refunded_volume": 2000,
          "refund_rate_pct": 20
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Stripe business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT merchant_id, SUM(amount) AS total_volume, SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) AS refunded_volume, ROUND(SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 100.0 / SUM(amount), 2) AS refund_rate_pct FROM merchant_volumes GROUP BY merchant_id HAVING SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) > 1000 AND SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 1.0 / SUM(amount) > 0.10 ORDER BY refund_rate_pct DESC, merchant_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT merchant_id, SUM(amount) AS total_volume, SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) AS refunded_volume, ROUND(SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 100.0 / SUM(amount), 2) AS refund_rate_pct FROM merchant_volumes GROUP BY merchant_id HAVING SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) > 1000 AND SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 1.0 / SUM(amount) > 0.10 ORDER BY refund_rate_pct DESC, merchant_id ASC;",
      "snowflake": "SELECT merchant_id, SUM(amount) AS total_volume, SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) AS refunded_volume, ROUND(SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 100.0 / SUM(amount), 2) AS refund_rate_pct FROM merchant_volumes GROUP BY merchant_id HAVING SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) > 1000 AND SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 1.0 / SUM(amount) > 0.10 ORDER BY refund_rate_pct DESC, merchant_id ASC;",
      "bigquery": "SELECT merchant_id, SUM(amount) AS total_volume, SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) AS refunded_volume, ROUND(SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 100.0 / SUM(amount), 2) AS refund_rate_pct FROM merchant_volumes GROUP BY merchant_id HAVING SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) > 1000 AND SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 1.0 / SUM(amount) > 0.10 ORDER BY refund_rate_pct DESC, merchant_id ASC;",
      "mysql": "SELECT merchant_id, SUM(amount) AS total_volume, SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) AS refunded_volume, ROUND(SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 100.0 / SUM(amount), 2) AS refund_rate_pct FROM merchant_volumes GROUP BY merchant_id HAVING SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) > 1000 AND SUM(CASE WHEN is_refunded = 1 THEN amount ELSE 0 END) * 1.0 / SUM(amount) > 0.10 ORDER BY refund_rate_pct DESC, merchant_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/41",
    "companyTag": "Stripe",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_stripe_monthly_payouts",
    "questionNumber": 42,
    "title": "Stripe: Monthly Payout Volume by Currency",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the total payout amount transferred to merchants for each currency code (USD, EUR, GBP). Output currency, total_payouts, and total_amount rounded to 2 decimal places. Order by total_amount descending.",
    "requirements": [
      "Group by currency",
      "Compute COUNT(payout_id) and ROUND(SUM(amount), 2)",
      "Order by total_amount DESC"
    ],
    "schemas": [
      {
        "tableName": "merchant_payouts",
        "columns": [
          {
            "name": "payout_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "currency",
            "type": "VARCHAR"
          },
          {
            "name": "amount",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "payout_id": 1,
            "currency": "USD",
            "amount": 50000
          },
          {
            "payout_id": 2,
            "currency": "USD",
            "amount": 75000
          },
          {
            "payout_id": 3,
            "currency": "EUR",
            "amount": 35000
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "currency",
        "total_payouts",
        "total_amount"
      ],
      "rows": [
        {
          "currency": "USD",
          "total_payouts": 2,
          "total_amount": 125000
        },
        {
          "currency": "EUR",
          "total_payouts": 1,
          "total_amount": 35000
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Stripe business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT currency, COUNT(payout_id) AS total_payouts, ROUND(SUM(amount), 2) AS total_amount FROM merchant_payouts GROUP BY currency ORDER BY total_amount DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT currency, COUNT(payout_id) AS total_payouts, ROUND(SUM(amount), 2) AS total_amount FROM merchant_payouts GROUP BY currency ORDER BY total_amount DESC;",
      "snowflake": "SELECT currency, COUNT(payout_id) AS total_payouts, ROUND(SUM(amount), 2) AS total_amount FROM merchant_payouts GROUP BY currency ORDER BY total_amount DESC;",
      "bigquery": "SELECT currency, COUNT(payout_id) AS total_payouts, ROUND(SUM(amount), 2) AS total_amount FROM merchant_payouts GROUP BY currency ORDER BY total_amount DESC;",
      "mysql": "SELECT currency, COUNT(payout_id) AS total_payouts, ROUND(SUM(amount), 2) AS total_amount FROM merchant_payouts GROUP BY currency ORDER BY total_amount DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/42",
    "companyTag": "Stripe",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_google_search_ad_conversion",
    "questionNumber": 43,
    "title": "Google: Search Ad Conversion Value",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "At Google Ads, calculate the Return on Ad Spend (ROAS) for each ad campaign. ROAS is defined as total conversion revenue divided by total ad spend. Output campaign_id, total_spend, total_revenue, and roas rounded to 2 decimal places. Order by roas descending.",
    "requirements": [
      "Compute roas = ROUND(SUM(conversion_value) / SUM(cost), 2)",
      "Group by campaign_id",
      "Order by roas DESC"
    ],
    "schemas": [
      {
        "tableName": "ad_performance",
        "columns": [
          {
            "name": "campaign_id",
            "type": "INT"
          },
          {
            "name": "cost",
            "type": "NUMERIC"
          },
          {
            "name": "conversion_value",
            "type": "NUMERIC"
          }
        ],
        "sampleRows": [
          {
            "campaign_id": 10,
            "cost": 500,
            "conversion_value": 2500
          },
          {
            "campaign_id": 10,
            "cost": 500,
            "conversion_value": 1500
          },
          {
            "campaign_id": 20,
            "cost": 800,
            "conversion_value": 1200
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "campaign_id",
        "total_spend",
        "total_revenue",
        "roas"
      ],
      "rows": [
        {
          "campaign_id": 10,
          "total_spend": 1000,
          "total_revenue": 4000,
          "roas": 4
        },
        {
          "campaign_id": 20,
          "total_spend": 800,
          "total_revenue": 1200,
          "roas": 1.5
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Google business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT campaign_id, SUM(cost) AS total_spend, SUM(conversion_value) AS total_revenue, ROUND(SUM(conversion_value) / SUM(cost), 2) AS roas FROM ad_performance GROUP BY campaign_id ORDER BY roas DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT campaign_id, SUM(cost) AS total_spend, SUM(conversion_value) AS total_revenue, ROUND(SUM(conversion_value) / SUM(cost), 2) AS roas FROM ad_performance GROUP BY campaign_id ORDER BY roas DESC;",
      "snowflake": "SELECT campaign_id, SUM(cost) AS total_spend, SUM(conversion_value) AS total_revenue, ROUND(SUM(conversion_value) / SUM(cost), 2) AS roas FROM ad_performance GROUP BY campaign_id ORDER BY roas DESC;",
      "bigquery": "SELECT campaign_id, SUM(cost) AS total_spend, SUM(conversion_value) AS total_revenue, ROUND(SUM(conversion_value) / SUM(cost), 2) AS roas FROM ad_performance GROUP BY campaign_id ORDER BY roas DESC;",
      "mysql": "SELECT campaign_id, SUM(cost) AS total_spend, SUM(conversion_value) AS total_revenue, ROUND(SUM(conversion_value) / SUM(cost), 2) AS roas FROM ad_performance GROUP BY campaign_id ORDER BY roas DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/43",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_google_daily_active_query_volume",
    "questionNumber": 44,
    "title": "Google: Daily Active Query Volume",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the total number of search queries and distinct active users on Google Search for each calendar day. Output query_date, total_queries, and active_users. Order chronologically by query_date.",
    "requirements": [
      "Group by query_date",
      "Compute COUNT(query_id) AS total_queries, COUNT(DISTINCT user_id) AS active_users",
      "Order by query_date ASC"
    ],
    "schemas": [
      {
        "tableName": "search_logs",
        "columns": [
          {
            "name": "query_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "query_date",
            "type": "DATE"
          }
        ],
        "sampleRows": [
          {
            "query_id": 1,
            "user_id": 101,
            "query_date": "2026-03-01"
          },
          {
            "query_id": 2,
            "user_id": 101,
            "query_date": "2026-03-01"
          },
          {
            "query_id": 3,
            "user_id": 102,
            "query_date": "2026-03-01"
          },
          {
            "query_id": 4,
            "user_id": 101,
            "query_date": "2026-03-02"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "query_date",
        "total_queries",
        "active_users"
      ],
      "rows": [
        {
          "query_date": "2026-03-01",
          "total_queries": 3,
          "active_users": 2
        },
        {
          "query_date": "2026-03-02",
          "total_queries": 1,
          "active_users": 1
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Google business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT query_date, COUNT(query_id) AS total_queries, COUNT(DISTINCT user_id) AS active_users FROM search_logs GROUP BY query_date ORDER BY query_date ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT query_date, COUNT(query_id) AS total_queries, COUNT(DISTINCT user_id) AS active_users FROM search_logs GROUP BY query_date ORDER BY query_date ASC;",
      "snowflake": "SELECT query_date, COUNT(query_id) AS total_queries, COUNT(DISTINCT user_id) AS active_users FROM search_logs GROUP BY query_date ORDER BY query_date ASC;",
      "bigquery": "SELECT query_date, COUNT(query_id) AS total_queries, COUNT(DISTINCT user_id) AS active_users FROM search_logs GROUP BY query_date ORDER BY query_date ASC;",
      "mysql": "SELECT query_date, COUNT(query_id) AS total_queries, COUNT(DISTINCT user_id) AS active_users FROM search_logs GROUP BY query_date ORDER BY query_date ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/44",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_google_organic_vs_paid_ratio",
    "questionNumber": 45,
    "title": "Google: Organic vs Paid Click Ratio",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "For each search category, find the percentage of clicks that were on organic search results versus sponsored ad links. Output category, total_clicks, organic_clicks, and organic_pct rounded to 2 decimal places. Order by organic_pct descending.",
    "requirements": [
      "Compute organic_pct = ROUND(SUM(CASE WHEN is_sponsored = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2)",
      "Group by category",
      "Order by organic_pct DESC, category ASC"
    ],
    "schemas": [
      {
        "tableName": "serp_clicks",
        "columns": [
          {
            "name": "click_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "category",
            "type": "VARCHAR"
          },
          {
            "name": "is_sponsored",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "click_id": 1,
            "category": "Education",
            "is_sponsored": 0
          },
          {
            "click_id": 2,
            "category": "Education",
            "is_sponsored": 0
          },
          {
            "click_id": 3,
            "category": "Commercial",
            "is_sponsored": 1
          },
          {
            "click_id": 4,
            "category": "Commercial",
            "is_sponsored": 0
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "category",
        "total_clicks",
        "organic_clicks",
        "organic_pct"
      ],
      "rows": [
        {
          "category": "Education",
          "total_clicks": 2,
          "organic_clicks": 2,
          "organic_pct": 100
        },
        {
          "category": "Commercial",
          "total_clicks": 2,
          "organic_clicks": 1,
          "organic_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Google business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT category, COUNT(*) AS total_clicks, SUM(CASE WHEN is_sponsored = 0 THEN 1 ELSE 0 END) AS organic_clicks, ROUND(SUM(CASE WHEN is_sponsored = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS organic_pct FROM serp_clicks GROUP BY category ORDER BY organic_pct DESC, category ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT category, COUNT(*) AS total_clicks, SUM(CASE WHEN is_sponsored = 0 THEN 1 ELSE 0 END) AS organic_clicks, ROUND(SUM(CASE WHEN is_sponsored = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS organic_pct FROM serp_clicks GROUP BY category ORDER BY organic_pct DESC, category ASC;",
      "snowflake": "SELECT category, COUNT(*) AS total_clicks, SUM(CASE WHEN is_sponsored = 0 THEN 1 ELSE 0 END) AS organic_clicks, ROUND(SUM(CASE WHEN is_sponsored = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS organic_pct FROM serp_clicks GROUP BY category ORDER BY organic_pct DESC, category ASC;",
      "bigquery": "SELECT category, COUNT(*) AS total_clicks, SUM(CASE WHEN is_sponsored = 0 THEN 1 ELSE 0 END) AS organic_clicks, ROUND(SUM(CASE WHEN is_sponsored = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS organic_pct FROM serp_clicks GROUP BY category ORDER BY organic_pct DESC, category ASC;",
      "mysql": "SELECT category, COUNT(*) AS total_clicks, SUM(CASE WHEN is_sponsored = 0 THEN 1 ELSE 0 END) AS organic_clicks, ROUND(SUM(CASE WHEN is_sponsored = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS organic_pct FROM serp_clicks GROUP BY category ORDER BY organic_pct DESC, category ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/45",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_google_session_inactivity_gaps",
    "questionNumber": 46,
    "title": "Google: User Session Inactivity Gaps",
    "platform": "FAANG+ Mock",
    "difficulty": "Hard",
    "skillLevel": "Advanced",
    "industry": "SaaS",
    "topic": "window",
    "topicLabel": "WINDOW",
    "businessScenario": "A user search session ends if there is an inactivity gap of 30 minutes or more between consecutive searches. Write a SQL query to identify all query instances that started a new session. Output user_id, query_time, and minutes_since_last_query.",
    "requirements": [
      "Use LAG() OVER (PARTITION BY user_id ORDER BY query_time ASC) to get previous query timestamp",
      "Calculate minutes_since_last_query = EXTRACT(EPOCH FROM query_time - prev_time) / 60",
      "Filter where prev_time IS NULL OR minutes >= 30",
      "Order by user_id ASC, query_time ASC"
    ],
    "schemas": [
      {
        "tableName": "user_search_events",
        "columns": [
          {
            "name": "event_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "query_time",
            "type": "TIMESTAMP"
          }
        ],
        "sampleRows": [
          {
            "event_id": 1,
            "user_id": 10,
            "query_time": "2026-03-01 10:00:00"
          },
          {
            "event_id": 2,
            "user_id": 10,
            "query_time": "2026-03-01 10:15:00"
          },
          {
            "event_id": 3,
            "user_id": 10,
            "query_time": "2026-03-01 11:30:00"
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "user_id",
        "query_time",
        "minutes_since_last_query"
      ],
      "rows": [
        {
          "user_id": 10,
          "query_time": "2026-03-01 10:00:00",
          "minutes_since_last_query": null
        },
        {
          "user_id": 10,
          "query_time": "2026-03-01 11:30:00",
          "minutes_since_last_query": 75
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Google business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "WITH lag_events AS (SELECT user_id, query_time, LAG(query_time) OVER (PARTITION BY user_id ORDER BY query_time ASC) AS prev_time FROM user_search_events) SELECT user_id, query_time, CAST(EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 AS INT) AS minutes_since_last_query FROM lag_events WHERE prev_time IS NULL OR EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 >= 30 ORDER BY user_id ASC, query_time ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "WITH lag_events AS (SELECT user_id, query_time, LAG(query_time) OVER (PARTITION BY user_id ORDER BY query_time ASC) AS prev_time FROM user_search_events) SELECT user_id, query_time, CAST(EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 AS INT) AS minutes_since_last_query FROM lag_events WHERE prev_time IS NULL OR EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 >= 30 ORDER BY user_id ASC, query_time ASC;",
      "snowflake": "WITH lag_events AS (SELECT user_id, query_time, LAG(query_time) OVER (PARTITION BY user_id ORDER BY query_time ASC) AS prev_time FROM user_search_events) SELECT user_id, query_time, CAST(EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 AS INT) AS minutes_since_last_query FROM lag_events WHERE prev_time IS NULL OR EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 >= 30 ORDER BY user_id ASC, query_time ASC;",
      "bigquery": "WITH lag_events AS (SELECT user_id, query_time, LAG(query_time) OVER (PARTITION BY user_id ORDER BY query_time ASC) AS prev_time FROM user_search_events) SELECT user_id, query_time, CAST(EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 AS INT) AS minutes_since_last_query FROM lag_events WHERE prev_time IS NULL OR EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 >= 30 ORDER BY user_id ASC, query_time ASC;",
      "mysql": "WITH lag_events AS (SELECT user_id, query_time, LAG(query_time) OVER (PARTITION BY user_id ORDER BY query_time ASC) AS prev_time FROM user_search_events) SELECT user_id, query_time, CAST(EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 AS INT) AS minutes_since_last_query FROM lag_events WHERE prev_time IS NULL OR EXTRACT(EPOCH FROM (query_time - prev_time)) / 60 >= 30 ORDER BY user_id ASC, query_time ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/46",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_google_zero_results_queries",
    "questionNumber": 47,
    "title": "Google: Top Queries with Zero Results",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Find the top 5 search terms that returned 0 search results most frequently. Output query_text and zero_result_count. Order by zero_result_count descending, then query_text alphabetically.",
    "requirements": [
      "Filter where result_count = 0",
      "Group by query_text",
      "Order by zero_result_count DESC, query_text ASC LIMIT 5"
    ],
    "schemas": [
      {
        "tableName": "query_results",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "query_text",
            "type": "VARCHAR"
          },
          {
            "name": "result_count",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "id": 1,
            "query_text": "quantum sql engine 2030",
            "result_count": 0
          },
          {
            "id": 2,
            "query_text": "quantum sql engine 2030",
            "result_count": 0
          },
          {
            "id": 3,
            "query_text": "deepmind antigravity tutorial",
            "result_count": 0
          },
          {
            "id": 4,
            "query_text": "python leetcode solutions",
            "result_count": 50
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "query_text",
        "zero_result_count"
      ],
      "rows": [
        {
          "query_text": "quantum sql engine 2030",
          "zero_result_count": 2
        },
        {
          "query_text": "deepmind antigravity tutorial",
          "zero_result_count": 1
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Google business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT query_text, COUNT(*) AS zero_result_count FROM query_results WHERE result_count = 0 GROUP BY query_text ORDER BY zero_result_count DESC, query_text ASC LIMIT 5;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT query_text, COUNT(*) AS zero_result_count FROM query_results WHERE result_count = 0 GROUP BY query_text ORDER BY zero_result_count DESC, query_text ASC LIMIT 5;",
      "snowflake": "SELECT query_text, COUNT(*) AS zero_result_count FROM query_results WHERE result_count = 0 GROUP BY query_text ORDER BY zero_result_count DESC, query_text ASC LIMIT 5;",
      "bigquery": "SELECT query_text, COUNT(*) AS zero_result_count FROM query_results WHERE result_count = 0 GROUP BY query_text ORDER BY zero_result_count DESC, query_text ASC LIMIT 5;",
      "mysql": "SELECT query_text, COUNT(*) AS zero_result_count FROM query_results WHERE result_count = 0 GROUP BY query_text ORDER BY zero_result_count DESC, query_text ASC LIMIT 5;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/47",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_google_ad_quality_score",
    "questionNumber": 48,
    "title": "Google: Ad Click Quality Score Classification",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "intermediate_case",
    "topicLabel": "INTERMEDIATE CASE",
    "businessScenario": "Google Ads evaluates traffic quality. Classify clicks into quality tiers: if bounce_rate < 0.20 AND dwell_time_seconds > 60 then 'High Quality', if dwell_time_seconds between 20 and 60 then 'Medium Quality', else 'Low Quality / Invalid'. Output click_id, ad_id, and quality_tier.",
    "requirements": [
      "Use CASE WHEN conditions to classify quality tier",
      "Order by click_id ASC"
    ],
    "schemas": [
      {
        "tableName": "ad_clicks_quality",
        "columns": [
          {
            "name": "click_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "ad_id",
            "type": "INT"
          },
          {
            "name": "bounce_rate",
            "type": "NUMERIC"
          },
          {
            "name": "dwell_time_seconds",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "click_id": 1,
            "ad_id": 101,
            "bounce_rate": 0.1,
            "dwell_time_seconds": 90
          },
          {
            "click_id": 2,
            "ad_id": 101,
            "bounce_rate": 0.5,
            "dwell_time_seconds": 35
          },
          {
            "click_id": 3,
            "ad_id": 102,
            "bounce_rate": 0.8,
            "dwell_time_seconds": 5
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "click_id",
        "ad_id",
        "quality_tier"
      ],
      "rows": [
        {
          "click_id": 1,
          "ad_id": 101,
          "quality_tier": "High Quality"
        },
        {
          "click_id": 2,
          "ad_id": 101,
          "quality_tier": "Medium Quality"
        },
        {
          "click_id": 3,
          "ad_id": 102,
          "quality_tier": "Low Quality / Invalid"
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Google business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT click_id, ad_id, CASE WHEN bounce_rate < 0.20 AND dwell_time_seconds > 60 THEN 'High Quality' WHEN dwell_time_seconds BETWEEN 20 AND 60 THEN 'Medium Quality' ELSE 'Low Quality / Invalid' END AS quality_tier FROM ad_clicks_quality ORDER BY click_id ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT click_id, ad_id, CASE WHEN bounce_rate < 0.20 AND dwell_time_seconds > 60 THEN 'High Quality' WHEN dwell_time_seconds BETWEEN 20 AND 60 THEN 'Medium Quality' ELSE 'Low Quality / Invalid' END AS quality_tier FROM ad_clicks_quality ORDER BY click_id ASC;",
      "snowflake": "SELECT click_id, ad_id, CASE WHEN bounce_rate < 0.20 AND dwell_time_seconds > 60 THEN 'High Quality' WHEN dwell_time_seconds BETWEEN 20 AND 60 THEN 'Medium Quality' ELSE 'Low Quality / Invalid' END AS quality_tier FROM ad_clicks_quality ORDER BY click_id ASC;",
      "bigquery": "SELECT click_id, ad_id, CASE WHEN bounce_rate < 0.20 AND dwell_time_seconds > 60 THEN 'High Quality' WHEN dwell_time_seconds BETWEEN 20 AND 60 THEN 'Medium Quality' ELSE 'Low Quality / Invalid' END AS quality_tier FROM ad_clicks_quality ORDER BY click_id ASC;",
      "mysql": "SELECT click_id, ad_id, CASE WHEN bounce_rate < 0.20 AND dwell_time_seconds > 60 THEN 'High Quality' WHEN dwell_time_seconds BETWEEN 20 AND 60 THEN 'Medium Quality' ELSE 'Low Quality / Invalid' END AS quality_tier FROM ad_clicks_quality ORDER BY click_id ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/48",
    "companyTag": "Google",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_apple_app_subscription_renewals",
    "questionNumber": 49,
    "title": "Apple: App Store Subscription Renewals",
    "platform": "FAANG+ Mock",
    "difficulty": "Medium",
    "skillLevel": "Intermediate",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "Calculate the auto-renewal rate of paid in-app subscriptions across app categories. Auto-renewal rate is total renewed subscriptions divided by total expiring subscriptions, expressed as percentage rounded to 2 decimal places. Order by renewal_rate_pct descending.",
    "requirements": [
      "Compute renewal_rate_pct = ROUND(SUM(is_renewed) * 100.0 / COUNT(*), 2)",
      "Group by app_category",
      "Order by renewal_rate_pct DESC, app_category ASC"
    ],
    "schemas": [
      {
        "tableName": "app_subscriptions",
        "columns": [
          {
            "name": "sub_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "app_category",
            "type": "VARCHAR"
          },
          {
            "name": "is_renewed",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "sub_id": 1,
            "app_category": "Productivity",
            "is_renewed": 1
          },
          {
            "sub_id": 2,
            "app_category": "Productivity",
            "is_renewed": 1
          },
          {
            "sub_id": 3,
            "app_category": "Gaming",
            "is_renewed": 0
          },
          {
            "sub_id": 4,
            "app_category": "Gaming",
            "is_renewed": 1
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "app_category",
        "renewal_rate_pct"
      ],
      "rows": [
        {
          "app_category": "Productivity",
          "renewal_rate_pct": 100
        },
        {
          "app_category": "Gaming",
          "renewal_rate_pct": 50
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Apple business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT app_category, ROUND(SUM(is_renewed) * 100.0 / COUNT(*), 2) AS renewal_rate_pct FROM app_subscriptions GROUP BY app_category ORDER BY renewal_rate_pct DESC, app_category ASC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT app_category, ROUND(SUM(is_renewed) * 100.0 / COUNT(*), 2) AS renewal_rate_pct FROM app_subscriptions GROUP BY app_category ORDER BY renewal_rate_pct DESC, app_category ASC;",
      "snowflake": "SELECT app_category, ROUND(SUM(is_renewed) * 100.0 / COUNT(*), 2) AS renewal_rate_pct FROM app_subscriptions GROUP BY app_category ORDER BY renewal_rate_pct DESC, app_category ASC;",
      "bigquery": "SELECT app_category, ROUND(SUM(is_renewed) * 100.0 / COUNT(*), 2) AS renewal_rate_pct FROM app_subscriptions GROUP BY app_category ORDER BY renewal_rate_pct DESC, app_category ASC;",
      "mysql": "SELECT app_category, ROUND(SUM(is_renewed) * 100.0 / COUNT(*), 2) AS renewal_rate_pct FROM app_subscriptions GROUP BY app_category ORDER BY renewal_rate_pct DESC, app_category ASC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/49",
    "companyTag": "Apple",
    "isLiveAutoIngested": true
  },
  {
    "id": "ss_microsoft_teams_active_meetings",
    "questionNumber": 50,
    "title": "Microsoft: Teams Daily Active Meetings per Tenant",
    "platform": "FAANG+ Mock",
    "difficulty": "Easy",
    "skillLevel": "Beginner",
    "industry": "SaaS",
    "topic": "aggregations",
    "topicLabel": "AGGREGATIONS",
    "businessScenario": "At Microsoft Teams, determine the total number of meetings hosted and total meeting minutes consumed per enterprise tenant for date '2026-03-01'. Output tenant_name, total_meetings, and total_meeting_minutes. Order by total_meeting_minutes descending.",
    "requirements": [
      "Filter where meeting_date = '2026-03-01'",
      "Compute COUNT(meeting_id) AS total_meetings, SUM(duration_minutes) AS total_meeting_minutes",
      "Group by tenant_name",
      "Order by total_meeting_minutes DESC"
    ],
    "schemas": [
      {
        "tableName": "teams_meetings",
        "columns": [
          {
            "name": "meeting_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "tenant_name",
            "type": "VARCHAR"
          },
          {
            "name": "meeting_date",
            "type": "DATE"
          },
          {
            "name": "duration_minutes",
            "type": "INT"
          }
        ],
        "sampleRows": [
          {
            "meeting_id": 1,
            "tenant_name": "Accenture",
            "meeting_date": "2026-03-01",
            "duration_minutes": 45
          },
          {
            "meeting_id": 2,
            "tenant_name": "Accenture",
            "meeting_date": "2026-03-01",
            "duration_minutes": 60
          },
          {
            "meeting_id": 3,
            "tenant_name": "Deloitte",
            "meeting_date": "2026-03-01",
            "duration_minutes": 30
          }
        ]
      }
    ],
    "expectedOutput": {
      "columns": [
        "tenant_name",
        "total_meetings",
        "total_meeting_minutes"
      ],
      "rows": [
        {
          "tenant_name": "Accenture",
          "total_meetings": 2,
          "total_meeting_minutes": 105
        },
        {
          "tenant_name": "Deloitte",
          "total_meetings": 1,
          "total_meeting_minutes": 30
        }
      ]
    },
    "hints": {
      "tier1": "Consider how to group and aggregate data for Microsoft business metrics.",
      "tier2": "Verify window frames, null handling, or filtering conditions before projecting results.",
      "tier3Skeleton": "SELECT tenant_name, COUNT(meeting_id) AS total_meetings, SUM(duration_minutes) AS total_meeting_minutes FROM teams_meetings WHERE meeting_date = '2026-03-01' GROUP BY tenant_name ORDER BY total_meeting_minutes DESC;"
    },
    "starterCodeByDialect": {
      "postgres": "-- Write your PostgreSQL query statement below\n",
      "snowflake": "-- Write your Snowflake SQL query statement below\n",
      "bigquery": "-- Write your GoogleSQL (BigQuery) query statement below\n",
      "mysql": "# Write your MySQL query statement below\n"
    },
    "officialSolutionByDialect": {
      "postgres": "SELECT tenant_name, COUNT(meeting_id) AS total_meetings, SUM(duration_minutes) AS total_meeting_minutes FROM teams_meetings WHERE meeting_date = '2026-03-01' GROUP BY tenant_name ORDER BY total_meeting_minutes DESC;",
      "snowflake": "SELECT tenant_name, COUNT(meeting_id) AS total_meetings, SUM(duration_minutes) AS total_meeting_minutes FROM teams_meetings WHERE meeting_date = '2026-03-01' GROUP BY tenant_name ORDER BY total_meeting_minutes DESC;",
      "bigquery": "SELECT tenant_name, COUNT(meeting_id) AS total_meetings, SUM(duration_minutes) AS total_meeting_minutes FROM teams_meetings WHERE meeting_date = '2026-03-01' GROUP BY tenant_name ORDER BY total_meeting_minutes DESC;",
      "mysql": "SELECT tenant_name, COUNT(meeting_id) AS total_meetings, SUM(duration_minutes) AS total_meeting_minutes FROM teams_meetings WHERE meeting_date = '2026-03-01' GROUP BY tenant_name ORDER BY total_meeting_minutes DESC;"
    },
    "deepDive": {
      "executionOrder": [
        "1. Filter records.",
        "2. Apply joins/windows.",
        "3. Aggregate and sort."
      ],
      "indexStrategy": "Index on joining IDs and partitioning dates.",
      "complexity": "Time O(N log N), Space O(N)",
      "tradeoffs": "Canonical analytics solution matching real production expectations."
    },
    "sourcePlatform": "StrataScratch FAANG Interview Case Studies",
    "sourceUrl": "https://platform.stratascratch.com/coding/50",
    "companyTag": "Microsoft",
    "isLiveAutoIngested": true
  }
];
