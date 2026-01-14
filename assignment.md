

## Pilot Briefing Assignment
## Introduction
Airlines and pilots rely heavily on accurate weather data because bad weather is the biggest hazard in aviation.
Two key meteorological products are:
METAR – Observation of current weather, reported hourly per airport
TAF – Weather outlook forecast for the next 24 hours, reported per airport
In addition, SIGMET messages warn pilots about hazardous weather over larger areas, such as countries.
Your task is to create a simple, form-based frontend web application that lets a pilot select airports and/or
countries of interest and then displays a briefing containing the latest METAR, TAF, and SIGMET reports.
## Assignment Requirements
Te c h n o l o g y
It’s recommended to use Angular framework, but you can use any framework you are comfortable with.
The UI can be minimal as long as it’s clean, readable, and functional. Feel free to make it more stylish if you enjoy UI
work, and use Material UI, Bootstrap, Ta i l w i n d, or any other tools you like working with.
## Form Input
Your application should star t with a for m where the pilot enters briefing criteria:
- Report Types - Selection for METAR, TAF (sent as "TAF_LONGTAF"), and SIGMET
- Airports - Text input for one or more ICAO airport codes (4 uppercase letters separated by spaces).
- Countries - Text input for one or more WMO country codes (2 uppercase letters separated by spaces).
Form must require at least one report type. It also must require at least one airport code or one country code.
Example of the Form:
Submitting the Form
On clicking Create Briefing, send an HTTP POST request to:
https://ogcie.iblsoft.com/ria/opmetquery
In the request body, use the JSON-RPC format:
reportTypes → report types selected by the user
stations → airport codes entered by the user
countries → country codes entered by the user
Example of the HTTP Request Body:
## {
## "id": "query01",
## "method": "query",
## "params": [
## {
## "id": "briefing01",
"reportTypes": ["METAR", "TAF_LONGTAF"],
"stations": ["LKPR", "EGLL"],
"countries": ["SQ"]
## }
## ]
## }
## Displaying Results
Show the results below the form on the same page and group them by stationId (from the HTTP response).
For each report, display the following data:
Station ID (stationId)
Report Type (queryType)
Report Time (reportTime) in Slovak local time zone and format (sk-SK)
Report Body (text) - Identify any segment that starts with BKN, FEW, or SCT immediately followed by three
digits (e.g., BKN025, FEW045) and apply color styling to the entire matching segment:
Blue if the numeric value is less than or equal to 30
Red if the numeric value is greater than 30
Example of the Results Table:
Example of the HTTP Response:
## Evaluation Criteria
When reviewing your submission, we will be looking for:
Adherence to the requirements, the solution should meet all specifications described in this document.
Readable and consistent code that is easy to understand and logically structured.
Well-structured components with proper communication between them.
Good handling of edge cases and unexpected situations, ensuring the application behaves gracefully.
High-quality naming conventions and clean style, making the codebase easy to maintain.
Proper error handling and robustness, preventing crashes or incomplete displays.
Maintainability and scalability, so that future features could be added without major rewrites.
## Submission
Host your project on StackBlitz.
Share a link to the project so we can review it.
Do not make the project public or indexable.
## Examples
Below are a few examples showing how the input form, the corresponding HTTP request, and the resulting briefing
table relate to each other. These are intended to illustrate the expected flow from user input to data retrieval and
display, not to cover all possible cases.
## Example #1
Briefing from METAR messages for airports LZIB (Bratislava), LKPR (Prague), EGLL (London - Heathrow)
## Form Input:
HTTP Request:
## {
## "id": "query01",
## "method": "query",
## "params": [
## {
## "id": "briefing01",
"reportTypes": ["METAR"],
"stations":["LZIB", "LKPR", "EGLL"]
## }
## ]
## }
## Results Table:
## Example #2
Briefing from METAR and TAF messages from Slovakia (WMO country code SQ) and from airports LKPR (Prague),
EGLL (London - Heathrow)
## Form Input:
HTTP Request:
## {
## "id": "query02",
## "method": "query",
## "params": [
## {
## "id": "briefing02",
"reportTypes": ["METAR", "TAF_LONGTAF"],
"stations":["LKPR", "EGLL"],
"countries": ["SQ"]
## }
## ]
## }
## Results Table:
## Example #3
Briefing from SIGMET messages for Slovakia (WMO country code SQ)
## Form Input:
HTTP Request:
## {
## "id": "query03",
## "method": "query",
## "params": [
## {
## "id": "briefing03",
"reportTypes": ["SIGMET"],
"countries": ["SQ"]
## }
## ]
## }
## Results Table:
## {
"error": null,
## "id": "query01",
## "result": [
## {
"placeId": "icao:EGLL",
"queryType": "METAR",
"receptionTime": "2016-06-15T10:54:21.218Z",
"reportTime": "2016-06-15T10:50:00Z",
"reportType": "MSG_METAR",
"revision": "COR",
"stationId": "EGLL",
"text": "EGLL 151050Z AUTO 18008KT 130V250 9999 FEW033/// //////CB 19/11 Q0996 TEMPO SHRA=",
"textHTML": "EGLL 151050Z AUTO 18008KT 130V250 <font color=\"blue\">9999</font> FEW033/// //////CB 19/11 Q0996 TEMPO SHRA="
## },
## {
"placeId": "icao:LKPR",
"queryType": "METAR",
"receptionTime": "2016-06-15T11:03:10.171Z",
"reportTime": "2016-06-15T11:00:00Z",
"reportType": "MSG_METAR",
"stationId": "LKPR",
"text": "LKPR 151100Z 23007KT 9999 BKN017 16/12 Q1002 NOSIG=",
"textHTML": "LKPR 151100Z 23007KT 9999 <font color=\"white\">BKN017</font> 16/12 Q1002 NOSIG="
## }
... truncated for readability ...
## ]
## }