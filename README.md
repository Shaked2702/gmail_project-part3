# project-ex3
**Part 3 of Gmail project**  
**Members: Shaked Shlasky Eliran Vasserman Dvir Avidan**  
  
Dear Tutor, we hope you have a pleasant testing, here are table of contents in readme.md:  
  
1. How to run the application and execute the tests  
2. Directory structure and file organization (including code, data, and other relevant components)  
3. Application architecture  
4. General issues or limitations  
5. Lecturer Guidelines and Design Reflections  
6. Running Examples (From Docker)  
  
Github repository link: https://github.com/Bar-Ilan-Bros/project-ex3  
Jira project link: https://eliranvass7425.atlassian.net/jira/software/projects/PE/boards/34  

    
```
         _nnnn_                           |     
        dGGGGMMb     ,"""""""""""""".     |   
       @p~qp~~qMb    | Linux Rules! |     |   
       M|@||@) M|   _;..............'     |        _
       @,----.JM| -'                      |       |E]
      JS^\__/  qKL                        |     .-|========-.
     dZP        qKRb                      |     | |FFT-MAIL |   
    dZP          qKKb                     |     |___________|___
   fZP            SMMb                    |          ||
   HZM            MMMM                    |          ||
   FqM            MMMM                    |          ||
 __| ".        |\dS"qML                   |          ||   www                %%%
 |    `.       | `' \Zq                   |   vwv    ||   )_(,;;;,        ,;,\_/ www
_)      \.___.,|     .'                   |   )_(    ||   \|/ \_/         )_(\|  (_)
\____   )MMMMMM|   .'                     |   \|   \ || /\\|/  |/         \| \|// | 
     `-'       `--' hjm                   |   ___\|//jgs||//_\V/_\|//_______\\|//V/\\|/__
------------------------------------------------------------------------------------------
                                         ##        .         
                                   ## ## ##       ==         
                                ## ## ## ##      ===         
                            /""""""""""""""""\___/ ===       
                       ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~
                            \______ o          __/           
                             \    \        __/               
                              \____\______/                                                                        
                                |          |                                   
                             __ |  __   __ | _  __   _                         
                            /  \| /  \ /   |/  / _\ |                          
                            \__/| \__/ \__ |\_ \__  |                            
```  
  
-------------------------------------------------------------------------------------------------------------  
**1. HOW TO RUN OUR APPLICATION AND TESTS**  
-------------------------------------------------------------------------------------------------------------  
There is a *Docker Image* including the *Blacklist Server*.  
There is a *Docker Image* including the *Mailbox Server*.  
There is a *Docker Image* including the *Mailbox Client*.  
We have implemented the Client Docker Container user interface as an interactive bash terminal.  
The communication between containers in on *Host network* - Host machine network stack.
  
A) Run the docker-compose file:  
**docker-compose up --build -d**  
(Run command from main directory of project: "project-ex3")  
(Creates 3 images and 3 containers as mentioned above)  
  
B) Enter client container bash:  
**docker exec -it mailbox_client bash**  
  
C) Run your "curl" commands or using ours from:  
**project-ex3/mailbox/examples.txt**  
  
    
Important - Database saved inside docker container:  
Closing *server* container of Mailbox or Blacklist will cause deletion of Database.  
Closing client container is fine.  
  
(Notice that for our check you should use urls matching regex explained in README part 4 - General Issues)  
  

-------------------------------------------------------------------------------------------------------------    
**Extra**  
Here are extra steps if you want to make a deeper check of the functioning.  
  
**Blacklist-Database**  
Check the Blacklist-Application database inside the blacklist_container's terminal.  
Run following commands:  
docker exec -it blacklist_server bash  
cd ../../data  
cat url.txt  
cat setup.txt  
Click "ctrl+D" to exit that bash.  
  
    
**Blacklist Multi-Threading**  
Check our multi-threading using the blacklist_server container:
1) Run multiple bashes of the container:
*docker exec -it blacklist_server bash* (Run it at least in 2 terminals)   
2) Open a python dummy client:  
*python3 Client.py 127.0.0.1 9160*  
3) Check the synchronization between terminals.  

For example there are 2 terminals and the order of execution is numberes in (i) format before each command.
*Terminal 1:*  
(1)POST www.example1.com  
201 Created  
(4)GET www.example1.com  
200 Ok  
  
true false
    
*Terminal 2:*  
(2)GET www.example1.com  
200 Ok  
  
true true  
(3)DELETE www.example1.com  
204 No Content  
  
(As you can see during two different terminals the blacklist database up to date)  
  

**Port configurations**  
Default port to communicate Blacklist Server: 9160  
If you need to change it for some reason, Change value in the top part of: *mailbox/src/models/blacklist.js*  
And also in lower part of: *blacklist/Dockerfile*  
  
  
-------------------------------------------------------------------------------------------------------------  
**2. DIRECTORY STRUCTURE AND FILE ORGANIZATION**  
-------------------------------------------------------------------------------------------------------------  
```
project-ex3  
├── README.md  
│  
├── blacklist                              Directory for the blacklist server  
│   ├── Dockerfile                         Docker environment image creation file  
│   ├── data  
│   │   └── data.txt                       Dummy file to keep the directory in GitHub  
│   ├── docker-compose.yml                 Docker compose file to configure multi-container application  
│   └── src  
│       ├── AddCommand.cpp                 Implements the command of add URL to Bloom using command interface  
│       ├── AddCommand.h                   Declares object  
│       ├── App.cpp                        Initializes and runs the main application infinite loop.  
│       ├── App.h                          Declares object  
│       ├── AppTest.cpp                    Tests for the App and Main epic (NOT-IN-USE)  
│       ├── BloomFilter.cpp                Implements the core Bloom filter logic, including Add or Check URLs  
│       ├── BloomFilter.h                  Declares object  
│       ├── CMakeLists.txt                 Generates Make commands for building executables  
│       ├── CheckCommand.cpp               Implements command of check URL to BloomFilter using command interface  
│       ├── CheckCommand.h                 Declares object  
│       ├── Client.py                      Python Client works with the server  
│       ├── CommandTest.cpp                Tests for the Command epic (NOT-IN-USE)    
│       ├── ConsoleMenu.cpp                Implements the Command Design Pattern using menu constants.  
│       ├── ConsoleMenu.h                  Declares object  
│       ├── DataStructureTest.cpp          Tests for the DataStructure epic.  
│       ├── Deadpool.cpp                   New module handling URL deletion and cleanup in BloomFilter  
│       ├── Deadpool.h                     Declares object for Deadpool module  
│       ├── DeleteCommand.cpp              Implements the Command of delete a URL from Bloom (Command Interface)  
│       ├── DeleteCommand.h                Declares object  
│       ├── HashFunctions.cpp              Implements hash functions used by the Bloom filter to map URLs.  
│       ├── HashFunctions.h                Declares object  
│       ├── HashFunctionsTestManual.cpp    Manual tests for hash functions not in use (NOT-IN-USE)  
│       ├── ICommand.h                     Declares the interface of Commands  
│       ├── IDataStructure.h               Declares the interface of DataStructure  
│       ├── IIO.h                          Declares the interface for input/output operations  
│       ├── IMenu.h                        Declares the interface for the menu logic  
│       ├── IOTest.cpp                     Tests for input/output functionalities (NOT-IN-USE)  
│       ├── ISetup.h                       Declares the interface for setting up the Bloom while the app launches  
│       ├── LineSetup.cpp                  Implements the logic for setting up the Bloom at launch for ex-1  
│       ├── LineSetup.h                    Declares object  
│       ├── Main.cpp                       Contains the entry to the application and the configurations to App  
│       ├── MenuTest.cpp                   Tests for the Menu epic (NOT-IN-USE)  
│       ├── SetupTest.cpp                  Tests for the Setup epic (NOT-IN-USE)  
│       ├── SocketIO.cpp                   Implements socket-based input/output operations  
│       ├── SocketIO.h                     Declares object for socket-based input/output operations  
│       ├── StreamIO.cpp                   Implements stream-based input/output operations  
│       ├── StreamIO.h                     Declares object for stream-based input/output operations  
│       └── exe                            Directory to store the main&tests executables (within container only)  
│           ├── Client.py                  Python Client works with the server  
│           └── main                      Main executable for the blacklist server  
├── details.txt                          Team members' details (submitted to Lemida system)  
├── docker-compose.yml                   Docker compose file to test multi-threading of blacklist server  
│  
├── mailbox                              Directory for the mailbox server  
│   ├── Dockerfile                       Docker image to run a mailbox server.  
│   ├── Dockerfile2                      Docker image to run a mailbox client.  
│   ├── src  
│   │   ├── app.js                       Entry point for the mailbox server, configures server and routes  
│   │   ├── examples.txt                 Sample API requests and responses for testing and reference  
│   │   ├── gmail_data.txt               Team usage - storing some Gmail real configurations.  
│   │   ├── controllers  
│   │   │   ├── blacklist.js             Controller handling blacklist-related API logic and data operations  
│   │   │   ├── labels.js                Controller managing label creation, retrieval, and modification  
│   │   │   ├── mails.js                 Controller for email CRUD operations and mailbox management  
│   │   │   ├── tokens.js                Controller for user authentication tokens management and validation  
│   │   │   └── users.js                 Controller managing user data, registration, and profile updates  
│   │   ├── models  
│   │   │   ├── blacklist.js             Model the blacklist operations with Blacklist external server    
│   │   │   ├── labels.js                Model representing email labels and their properties  
│   │   │   ├── mails.js                 Model handling the schema and data logic for emails  
│   │   │   ├── tokens.js                Model managing user authentication tokens and expiry  
│   │   │   └── users.js                 Model representing user information and account management  
│   │   ├── routes  
│   │   │   ├── blacklist.js             Defines API endpoints for blacklist-related operations  
│   │   │   ├── labels.js                Routes handling HTTP requests related to email labels  
│   │   │   ├── mails.js                 Routes for managing email CRUD operations via HTTP  
│   │   │   ├── tokens.js                Routes for user authentication token management and refresh  
│   │   │   └── users.js                 Routes managing user account actions and profile updates  
│   │   ├── package-lock.json            Auto-generated lock file for npm to ensure consistent installs  
│   │   └── package.json                 npm package metadata and dependencies for the mailbox project  
└── proofs  
    └── Project-progress-part3.docx      Project documentation and progress report for part 3  
```
  
  
  
-------------------------------------------------------------------------------------------------------------  
**3. APPLICATION ARCHITECTURE**  
-------------------------------------------------------------------------------------------------------------  
  
***Part 1 - Blacklist Application***  
**A. IDataStructure (Interface)**  
Related Objects:  
BloomFilter (implements IDataStructure)  
HashFunctions (member of BloomFilter)  
  
**B. ICommand (Interface)**  
Related Objects:  
AddCommand (implements ICommand)  
CheckCommand (implements ICommand)  
DeleteCommand (impelements ICommand)  
  
**C. IMenu (Interface)**  
Related Objects:  
ConsoleMenu (implements IMenu)  
  
**D. ISetup (Interface)**  
Related Objects:  
LineSetup (implements ISetup)  
  
**E. IIO (Interface)**  
Related Objects:  
StreamIO (implements IIO)  
SocketIO (implements IIO)  
  
**F. App (Object)**  
Members:  
IDataStructure (BloomFilter object only at the moment)  
IMenu (ConsoleMenu object only at the moment)  
SocketIO (Two fields: input, output. At the moment usage is with same instance)  
String (Two fields: url_path, setup_path. Saving our data locations)  
  
  
***Part 2 - Mailbox Application***  
**A. Controllers**
Related Objects:  
blacklist.js – Handles API logic and interaction with external blacklist server  
labels.js – Manages logic for label creation and retrieval  
mails.js – Implements operations for sending, receiving, and managing emails  
tokens.js – Handles authentication token validation and refresh logic  
users.js – Manages user account logic including registration and login  
  
**B. Models** 
Related Objects:  
blacklist.js – Defines communication model for blacklist validation over TCP  
labels.js – Structures user-defined labels for mailbox organization  
mails.js – Represents the mail entity structure and functions include "query"  
users.js – Defines schema and operations for user credentials  
tokens.js – Model to manage issued tokens and expiration rules  

**C. Routes**  
Related Objects:  
blacklist.js – Declares API routes for blacklist-related operations  
labels.js – Defines routes to perform label-related HTTP actions  
mails.js – Provides REST endpoints for email management  
tokens.js – Sets up token refresh, revoke, and verify routes  
users.js – Routes for user signup, login, and profile access  
  
**D. Server**  
Related Object:  
app.js – Initializes and configures the mailbox server, sets up settings and routes  
  
  
  
-------------------------------------------------------------------------------------------------------------  
**4. GENERAL ISSUES**  
-------------------------------------------------------------------------------------------------------------  
**A) Mail 'object' is created per mailbox.**  
Meaning while creating new mail you will receive different mail_ids for different users.  
In addition Get/Update/Delete may be different between users.  
  
**B) Special characters inside URL:**  
Search operation using GET and Blacklist operation using GET (for example), may contain special character.  
  
For example, for a query using 'whitespace' we will use matching url endocing %20:  
Instead of running:         curl -i -X GET http://localhost:3000/api/mails/search/Hello Bob  
We will run:                curl -i -X GET http://localhost:3000/api/mails/search/Hello%20Bob  
  
For example, for a blacklist GET using '/' we will use matching url endocing %2F:  
Instead of running:         curl -i -X GET http://localhost:3000/api/blacklist/www.example3.com/path  
We will run:                curl -i -X GET http://localhost:3000/api/blacklist/www.example3.com%2Fpath  
  
**C) URL format which the Blacklist application (BloomFilter) accepts is according to next regex:**  
  
R"(^\s*((https?|HTTPS?)://)?([a-zA-Z0-9-]+.)+[a-zA-Z]{2,}([a-zA-Z0-9-./%&=])?\s$)" Generally: you are allowed start with https:// or http:// or not starting pattern. Whitespace at middle of URL is NOT allowed. Whitespace at start or end of URL in allowed (and needed) by comment on lambda's forum by lecturer (but note it would be stored and checked ignoring these whitespaces). The rest is standard by google: www.allowed.example.com, www.num123.com, www.fill.com/free-to-use-123-end  
  
**D) Case Sensitiveness in Blacklisting:**  
As known in real life URL could be both UPPER CASE and LOWER CASE. We will use real life rule. First we define 'Domain' and 'Path' with an example: "www.example.com/path/of/url" DOMAIN = "www.example.com" is RESPECTING different cases. PATH = "path/of/url" is NOT RESPECTING different cases. Thus, our program will return "true" value for different lower/upper case input url in the 'domain' part, and "false" if it was in the 'path' part.  
For consistency, our database is saving all the url's domain part in LOWERCASE.  
  
**E) Docker container is saving data locally on it.**  
Delete container will reset database (as wanted).  
(Applicalbe to both 'mailbox_server' container and 'blacklist_server' container)  
In addition of course if you will enter the 'mailbox_server' container, and restart 'node app.js' data base will be deleted (as wanted in-memory for part3).  
  
  
-------------------------------------------------------------------------------------------------------------  
**5. Lecturer Guidelines and Design Reflections**  
-------------------------------------------------------------------------------------------------------------  
This section represents Hemi's points to reflect in the readme - page X of task pdf file.  
  
Part 3 of the project DO NOT have these questions.
  
  
-------------------------------------------------------------------------------------------------------------  
**6.RUNNING EXAMPLES**  
-------------------------------------------------------------------------------------------------------------  
  
**API usage with curl**
```  
**Users**    
*A) Create user:*  
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alice",
    "last_name": "Smith",
    "birthDay": "1999-05-15",
    "gender": "female",
    "email": "alice.smith@example.com",
    "password": "SecurePass123!",
    "phone_number": "0523456789"
  }'   

*Response*:  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/users/1
Date: Sat, 31 May 2025 13:38:59 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
  
  
*Create second user:*  
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Bob",
    "last_name": "Bob",
    "birthDay": "1999-05-15",
    "gender": "female",
    "email": "bobbob@example.com",
    "password": "SecurePass123%",
    "phone_number": "0523456789"
  }'
  
*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/users/2
Date: Sat, 31 May 2025 13:40:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
  
  
*Create third user:*  
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Eliran",
    "last_name": "Eliran",
    "birthDay": "1999-05-15",
    "gender": "female",
    "email": "FFTFFT@example.com",
    "password": "SecurePass123%",
    "phone_number": "0523456789"
  }'  
    
*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/users/3
Date: Sat, 31 May 2025 13:43:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
  
  
*B) Get user (Notice no password returned):*    
curl -i -X GET http://localhost:3000/api/users/1  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 166
ETag: W/"a6-26Psc/zBEVIds37YXbSYS2Ns9Go"
Date: Sat, 31 May 2025 13:57:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"first_name":"Alice","last_name":"Smith","birthDay":"1999-05-15","gender":"female","email":"alice.smith@example.com","phone_number":"0523456789","image":null}  
  
  
-------------------------------------------------------------------------------------------------------------  
**Tokens**  
*C) Create token (Notice return value as "token" is user_id by task guidance):*  
curl -i -X POST http://localhost:3000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.smith@example.com",
    "password": "SecurePass123!"
  }'  

*Response*:  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 13
ETag: W/"d-JIUH0uCrPduuFSejOgtPO/FcqaE"
Date: Sat, 31 May 2025 14:23:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"token":"1"}  
  
  
*D) Create token with wrong password:*  
curl -i -X POST http://localhost:3000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.smith@example.com",
    "password": "WrongPassword123!"
  }'   
  
*Response*:  
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 42
ETag: W/"2a-jHqp2PJ64U7PVRfoYAkXInFhrAQ"
Date: Sat, 31 May 2025 14:26:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"error":"Email or password is incorrect"}  
  
  
-------------------------------------------------------------------------------------------------------------  
**Labels**  
*E) Create label:*  
curl -i -X POST http://localhost:3000/api/labels \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "name": "urgent"
  }'  
    
*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/labels/1
Date: Sat, 31 May 2025 13:46:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
  

*F) Create another label:*  
curl -i -X POST http://localhost:3000/api/labels \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "name": "fft"
  }'  
  
*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/labels/2
Date: Sat, 31 May 2025 13:51:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
  
  
*G) Get labels for user "1":*  
curl -i -X GET http://localhost:3000/api/labels \
  -H "user_id: 1"  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 48
ETag: W/"30-6PGygMYeOfjicnX0ZzSBmeDUFoA"
Date: Sat, 31 May 2025 13:54:09 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
[{"id":1,"name":"urgent"},{"id":2,"name":"fft"}]  
  
  
*H) Get label for id "2" (belongs to user id "1"):*  
curl -i -X GET http://localhost:3000/api/labels/2 \
  -H "user_id: 1"  
  
*Respone:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-ys9LOxteIGcE3jU/i9WdUIDciIk"
Date: Sat, 31 May 2025 14:01:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5
  
{"id":2,"name":"fft"}  
  
  
*H) Get label for id "2" - when no matching user id sent (user id 2 instead of 1) - Forbidden:*  
curl -i -X GET http://localhost:3000/api/labels/2 \
  -H "user_id: 2"  
  
*Respone:*  
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 45
ETag: W/"2d-8fDIq71MCtvrzBwagsxtignc7Bw"
Date: Sat, 31 May 2025 14:02:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"error":"Label does not belong to the user"}  
  
  
*I) Update label:*  
curl -i -X PATCH http://localhost:3000/api/labels/2 \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{ "name": "high-priority" }'  
  
*Response:*  
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sat, 31 May 2025 14:04:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
*Another Get to assure modified (Running command listed as 'H'):*  
{"id":2,"name":"high-priority"}  
  
  
*J) Delete label:*  
curl -i -X DELETE http://localhost:3000/api/labels/2 \
  -H "user_id: 1"  
  
*Response:*  
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sat, 31 May 2025 14:07:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
*Another Get to assure deleted (Running command listed as 'H'):*  
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 27
ETag: W/"1b-s8gRgT0pAVphI512pGVUh5Lwo5w"
Date: Sat, 31 May 2025 14:08:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"error":"Label not found"}  
  
  
-------------------------------------------------------------------------------------------------------------  
**Blacklist**  
*K) Add Blacklisted Url (Notice id=url, otherwise there is no meaning to the bloom filter server):*  
curl -i -X POST http://localhost:3000/api/blacklist \
  -H "Content-Type: application/json" \
  -d '{ "id": "www.example.com" }'  
  
*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/blacklist/www.example.com
Date: Sat, 31 May 2025 14:13:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
    
  
*L) Delete Blacklisted Url:*  
curl -i -X DELETE http://localhost:3000/api/blacklist/www.example.com  
(Notice if you want to delete a special characters in url given you should use encoding into url format:
.../api/blacklist/www.example33.com%2Fexample%2Ffft instead of .../api/blacklist/www.example33.com/example/fft)  
  
*Response:*  
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sat, 31 May 2025 14:16:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
    
  
*M) Recreated Blacklist on: www.example.com - for mail blacklist checks - using command 'K'*  
  
  
-------------------------------------------------------------------------------------------------------------  
**Mails**  
*N) Create new mail for user id "1" (sender):*  
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bobbob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email for Bob."
  }'  

*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/mails/2
Date: Sun, 01 Jun 2025 08:25:58 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
*(Notice created with mail_id:2 via Location - Reason: 2 copies for sender and receiver)*  
  
  
*Create another new mail:*  
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bobbob@example.com"],
    "subject": "Hello World!",
    "content": "This is a test email for the World of Hello."
  }'  
  
*Response:*  
HTTP/1.1 201 Created
X-Powered-By: Express
Location: /api/mails/4
Date: Sun, 01 Jun 2025 08:26:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 0  
  
  
*O) Get mails for user id "1":*  
curl -i -X GET http://localhost:3000/api/mails \
  -H "user_id: 1"  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 525
ETag: W/"20d-x0zbxnuKfO93+NZb+g582qeyfCA"
Date: Sun, 01 Jun 2025 08:26:36 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
[{"id":4,"user_id":1,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello World!","body":"This is a test email for the World of Hello.","created_at":"2025-06-01T08:26:22.561Z","labels":[],"is_opened":true,"is_starred":false},{"id":2,"user_id":1,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello Bob","body":"This is a test email for Bob.","created_at":"2025-06-01T08:25:58.211Z","labels":[],"is_opened":true,"is_starred":false}]  
*(You can see two mails created at total with id:2, id:4 by decreasing id&time order)  
  

*P) Get mails by mail id "2" (for user id "1" - the "sender" - alice):*  
curl -i -X GET http://localhost:3000/api/mails/2 \
  -H "user_id: 1"
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 252
ETag: W/"fc-p/ZkLXLf+qvZznznMWotGMsodIs"
Date: Sun, 01 Jun 2025 08:27:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"id":2,"user_id":1,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello Bob","body":"This is a test email for Bob.","created_at":"2025-06-01T08:25:58.211Z","labels":[],"is_opened":true,"is_starred":false}  
    
  

*Q) Check mail has received in receiver mailbox (Bob id=2):*  
(Get all mails for user id "2")    
curl -i -X GET http://localhost:3000/api/mails \
  -H "user_id: 2"  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 527
ETag: W/"20f-6mHYnq6Nw4Zc+MoIVpxlPiWev3o"
Date: Sun, 01 Jun 2025 08:28:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
[{"id":3,"user_id":2,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello World!","body":"This is a test email for the World of Hello.","created_at":"2025-06-01T08:26:22.561Z","labels":[],"is_opened":false,"is_starred":false},{"id":1,"user_id":2,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello Bob","body":"This is a test email for Bob.","created_at":"2025-06-01T08:25:58.211Z","labels":[],"is_opened":false,"is_starred":false}]  
  
  
*R) Check mail has received in receiver mailbox by id:*  
(In previous command we have seen mail_id:1 in receiver mailbox - user_id of Bob is 2)  
curl -i -X GET http://localhost:3000/api/mails/1 \
  -H "user_id: 2"  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 253
ETag: W/"fd-kRYFagVr8lqMerTrtbA1z25x/BU"
Date: Sun, 01 Jun 2025 08:31:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"id":1,"user_id":2,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello Bob","body":"This is a test email for Bob.","created_at":"2025-06-01T08:25:58.211Z","labels":[],"is_opened":false,"is_starred":false}  
  
  
*S) Create mail with blacklisted url (www.example.com - blacklisted in step 'M'):*  
curl -i -X POST http://localhost:3000/api/mails \
  -H "Content-Type: application/json" \
  -H "user_id: 1" \
  -d '{
    "receivers_emails": ["bob@example.com"],
    "subject": "Hello Bob",
    "content": "This is a test email ya ya ya www.example.com for www.example4.com Bob. www.example8.com www.example11.com    Visit www.example2.com  for more info ya ya ya, www.example5.com"
  }'  

*Response:*  
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-KZhKrcXP6aJO0tjjtTSeiVcG9r4"
Date: Sun, 01 Jun 2025 08:33:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Email contains blacklisted URL","blacklisted":"www.example.com"}  
    
  
*T) Update mail by mail id (in this example updating subject only):*  
curl -i -X PATCH http://localhost:3000/api/mails/3 \
  -H "Content-Type: application/json" \
  -H "user_id: 2" \
  -d '{
    "receivers_emails": ["bobbob@example.com"],
    "subject": "Updated Subject"
}'  
  
*Response:*  
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sun, 01 Jun 2025 08:50:22 GMT
Connection: keep-alive
Keep-Alive: timeout=5  


*U) Check mail has updated in bob mailbox via GET:*  
(In previous command we have updated mail_id:3 in Bob's mailbox - user_id:2)  
curl -i -X GET http://localhost:3000/api/mails/3 \
  -H "user_id: 2"  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 230
ETag: W/"e6-YT0wO+k8ILrxje82/ZPIojT+Ce4"
Date: Sun, 01 Jun 2025 08:52:50 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
{"id":3,"user_id":2,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Updated Subject","body":"","created_at":"2025-06-01T08:50:22.590Z","labels":[],"is_opened":false,"is_starred":false}  
(As you can see Subject has updated - same way we can update contenct, etc...)  
  
  
*V) Delete mail by mail id (matching user id is needed):*  
curl -i -X DELETE http://localhost:3000/api/mails/3 \
  -H "user_id: 2"  
  
*Response:*  
HTTP/1.1 204 No Content
X-Powered-By: Express
Date: Sun, 01 Jun 2025 08:55:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
  
-------------------------------------------------------------------------------------------------------------  
**Query**  
*W) Make query for user mailbox (Search string match in subject/content/sender/receiver):*  
curl -i -X GET http://localhost:3000/api/mails/search/Hello%20Bob \
  -H "user_id: 1"  
  
*Response:*  
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 254
ETag: W/"fe-7ssZMQjwLQx1fadBEqnyEu+ZUIA"
Date: Sun, 01 Jun 2025 08:56:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5  
  
[{"id":2,"user_id":1,"sender_email":"alice.smith@example.com","receivers_emails":["bobbob@example.com"],"subject":"Hello Bob","body":"This is a test email for Bob.","created_at":"2025-06-01T08:25:58.211Z","labels":[],"is_opened":true,"is_starred":false}]  
  
  
  
-------------------------------------------------------------------------------------------------------------  
**Project part 3 Blacklist Server Multi-threading**  
(There are 2 terminals and the order of execution is numberes in (i) format before each command)
(You will see synchronization between two clients outputs, and obviously running simultaneously)

*Terminal 1:*  
(1)POST www.example1.com  
201 Created  
(4)GET www.example1.com  
200 Ok  
  
true false
    
*Terminal 2:*  
(2)GET www.example1.com  
200 Ok  
  
true true  
(3)DELETE www.example1.com  
204 No Content  
  
  
-------------------------------------------------------------------------------------------------------------  
**Project part 2 runs - still same input/ouput:**  
*A) Run from clear database:*  
(Server Side)  
./main 8020 8 1 2  
  
(Client Side)  
python3 Client.py 127.0.0.1 8020  
POST www.example.com  
201 Created  
GET www.example.com  
200 Ok  
  
true true  
  
  
*B) Close and reopen the program:*  
(No bloom settings arguments needed, Database should be saved)  
(Server Side)  
./main 8020  
  
(Client Side)  
python3 Client.py 127.0.0.1 8020  
GET www.example.com2  
200 Ok  
  
false  
GET www.example.com  
200 Ok  
  
true true  
  
  
*C) Check illegal inputs (Illegal command, illegal url, illegal syntax):*  
(Client Side)  
asdsa  
400 Bad Request  
POST 12321      
400 Bad Request  
POST www.example.com www.example2.com  
400 Bad Request  
  
  
*D) Check logical problem inputs (Delete URL no exists):*  
(Client Side)  
DELETE www.dijkstra.com  
404 Not Found  
  
  
*E) Check lowercase/highercase synchronization:*  
(Respecting cases in domain, not respecting cases in path)  
(Client Side)  
POST https://www.domain/path          
201 Created  
GET https://www.DOMAIN/path  
200 Ok  
  
true true  
GET https://www.domain/PATH  
200 Ok  
  
false  
  
  
*F) Adding & Checking then Deleting & Checking:*  
(Should be false-positive because bits are saved)  
(Client Side)  
POST www.fft.com  
201 Created  
GET www.fft.com  
200 Ok  
  
true true  
DELETE www.fft.com  
204 No Content  
GET www.fft.com  
200 Ok  
  
true false  
  
  
*G) Running client&quit, then launch another client:*  
(Should continue working for new clients)  
  
(Client1)  
python3 Client.py 127.0.0.1 8020  
POST dijkstra.king.com  
201 Created  
GET dijkstra.king.com      
200 Ok  
  
true true  
GET belman.ford.loser  
200 Ok  
  
false  
  
(Client2)  
python3 Client.py 127.0.0.1 8020  
GET dijkstra.king.com  
200 Ok  
  
true true  
GET p.equal.np.com  
200 Ok  
  
false  
DELETE dijkstra.king.com  
204 No Content  
  
(Client3)  
python3 Client.py 127.0.0.1 8020  
GET dijkstra.king.com  
200 Ok  
  
true false  
DELETE p.equal.np.com  
204 No Content  
```  
  
-------------------------------------------------------------------------------------------------------------  
**THE-END**  
-------------------------------------------------------------------------------------------------------------  