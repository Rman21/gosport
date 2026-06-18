# Netanya Sport Catalog Research

Date checked: 2026-06-18

Scope: source-backed seed catalog for the SportIL Netanya mobile web slice.

## Source Confidence Rules

SportIL distinguishes public information from live inventory:

- `official_info`: official or city-linked source confirms facility, sport, address, accessibility, hours, or class description.
- `operator_confirmed`: an operator or coach confirms a specific slot/capacity.
- `live_inventory`: a connector returns real-time bookable capacity.
- `manual_review`: editorial or demo value added by SportIL and requiring review before production use.

Only `operator_confirmed` or `live_inventory` slots may become instant payment bookings. The Epic 0 booking/payment slice uses demo capacity and must remain clearly marked as mock.

## Official Netanya Source Notes

The official Netanya sports facilities page describes city sports facilities for residents, including fitness facilities, football fields, basketball halls, and more. It exposes facility filters by sports-site type and neighborhood, including open fitness, combined courts, basketball halls, futsal fields, skating, tennis courts, and other facilities.

Source: https://www.netanya.muni.il/facilities

The official Netanya classes page exposes age categories and class types including badminton, judo, skating, self-defense, wrestling, gymnastics, pilates, taekwondo, tennis, table tennis, football, girls' basketball, boys' basketball, adapted basketball, walking football/futsal variants, capoeira, karate, krav maga, crossfit, dance, and ballroom dance.

Source: https://www.netanya.muni.il/City/SportsAndSociety/Classes/Pages/ID/sport_classes_list.aspx

The official Netanya sports clubs page states that active sports associations operate in basketball, football, swimming, judo, and other branches. The listed branches include football, basketball, table tennis, athletics, fencing/boxing, acrobatics, karate, wrestling, jiu-jitsu, judo, aquathlon, tennis, lawn bowling, handball, swimming, judo, and karate.

Source: https://www.netanya.muni.il/City/SportsAndSociety/Pages/Clubs.aspx

## Seed Facilities And Programs

### Netanya Tennis Center - Gali Yam

- Source confirms: municipal tennis center managed by Yael Beckman; children and youth classes, advanced training, adult and beginner classes, and public use.
- Address: Bnei Binyamin 1.
- Contact shown by source: Yael Beckman, 052-2734256.
- SportIL confidence: `official_info`; demo verified slots can be used only in mock mode until operator confirmation.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/galyyam.aspx

### Beginner Tennis Class - Gali Yam

- Source confirms: tennis class at Gali Yam, registration link, coordinator/instructor Yael Beckman.
- Source shows cost: 220 NIS.
- Source has a data inconsistency: search tags include ages 7-12, while the field body shows age 0-6. SportIL must display this as source-backed but requiring confirmation before production enrollment.
- Source confirms: accessibility yes, parking no, activity frequency twice per week.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/Classes/Pages/ID/Tennis1.aspx

### Ovadia Tennis Court

- Source confirms: public tennis court complex on Ovadia Street near the community center; open to the public free of charge.
- Sport: tennis.
- Neighborhood: Neot Ganim.
- Accessibility: no.
- Lighting: yes.
- Parking: no.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/facilities/Pages/id/Ovadiahtennis.aspx

### Sportek Ir Yamim Combined Court

- Source confirms: combined court at Sderot Ben Gurion 170, open to the public free of charge.
- Sports: futsal and basketball.
- Accessibility: yes.
- Lighting: yes.
- Parking: exists.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/facilities/Pages/id/sportekiryamimcourt.aspx

### Yeshurun Sports Center

- Source confirms: located at Yeshurun School, Shmuel Hanatziv 45.
- Programs: adult national-league basketball and boys/girls basketball.
- Hours: Sunday-Thursday, 16:00-21:00.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/Yeshurun.aspx

### Yeshurun Sports Hall

- Source confirms: basketball hall at Yeshurun School, Shmuel Hanatziv 45.
- Amateur activity possible based on availability, without instructor, by advance coordination with Carmit Gigi at 072-3201746.
- Accessibility: no.
- Lighting: yes.
- Parking: no.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/facilities/Pages/id/Yeshurunvenue.aspx

### Girls Basketball - Yeshurun

- Source confirms: girls' basketball for grades 4-6/children 7-12 at Yeshurun.
- Source confirms: Tuesday 16:00-16:45 and Thursday 16:30-17:15.
- Source confirms: cost 225 NIS, coordinator Hagar Shimoni, instructor Shahar Frank.
- Accessibility: yes.
- Parking: exists.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/Classes/Pages/ID/GirlsBaketball20.aspx

### Stakelis Sports Center

- Source confirms: located at Stakelis School, Yehuda Perach 11.
- Programs: basketball, taekwondo, competitive basketball.
- Hours: Sunday-Thursday, 16:00-21:00.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/stakelis.aspx

### Bialik Sports Center

- Source confirms: located at Bialik School, Bialik 17.
- Program: judo.
- Hours: Monday and Wednesday, 16:45-18:15.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/Centers/Pages/Bialik.aspx

### Adapted Sport For Special Needs

- Source confirms: Tamar Ariel/Shapira school hosts a special-needs sport center with basketball plus self-defense, football, and zumba.
- Schedule: Sunday and Wednesday by age group; youth ages 14-21 at 17:15-18:00, adults 21+ at 18:00-18:45.
- Source also confirms capoeira for children ages 4-12 with developmental/language/communication difficulties on Tuesdays in small age-based groups.
- Source: https://www.netanya.muni.il/City/SportsAndSociety/PWD/Pages/SpecialNeeds.aspx

## Visual Asset Notes

Official Netanya pages expose image assets for sport centers and facilities. The Epic 0 web app may reference those public image URLs directly for prototype visualization. Before production, SportIL should confirm reuse rights and ideally store optimized, licensed derivatives.

Known useful official image URLs:

- Gali Yam tennis center: https://www.netanya.muni.il/PublishingImages/%D7%A1%D7%A4%D7%95%D7%A8%D7%98/%D7%90%D7%AA%D7%A8%D7%99%D7%9D/SL47/%D7%AA%D7%96%27/12.jpg
- Sportek Ir Yamim: https://www.netanya.muni.il/PublishingImages/%D7%A1%D7%A4%D7%95%D7%A8%D7%98/%D7%90%D7%AA%D7%A8%D7%99%D7%9D/SL114/%D7%AA%D7%96%27/1.jpg
- Yeshurun/Bialik-style sports center image: https://www.netanya.muni.il/PublishingImages/%D7%A1%D7%A4%D7%95%D7%A8%D7%98/%D7%90%D7%AA%D7%A8%D7%99%D7%9D/SL83/%D7%AA%D7%96%27/1.jpg
- Public tennis class image: https://www.netanya.muni.il/PublishingImages/%D7%A1%D7%A4%D7%95%D7%A8%D7%98/%D7%97%D7%95%D7%92%D7%99%D7%9D/%D7%98%D7%A0%D7%99%D7%A1/%D7%AA%D7%96%27/1.jpg
- Bialik sports center image: https://www.netanya.muni.il/PublishingImages/%D7%A1%D7%A4%D7%95%D7%A8%D7%98/%D7%90%D7%AA%D7%A8%D7%99%D7%9D/SL41/6.JPG

## Product Implications

- The first catalog should show source status, date checked, and whether a slot is instant-bookable, request-only, or information-only.
- The search index should include sport, facility, program, coach/instructor, age, neighborhood, accessibility, and free/public terms.
- The detail page should show age fit, coach/school/group data, accessibility, parking/lighting, and capacity confidence before any action.
- Instant mock payment is permitted only for one demo slot with explicit mock labeling.
- Map mode should remain disabled until ADR-0009 is implemented with a provider adapter.
