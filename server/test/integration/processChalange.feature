@e2e @udp
Feature: Process chalanage
	In order to recive dgram packet from the Desktop Client
	As a Server
	Server is decide to allow or deny process and send back response to Desktop Client

	Background:
		Given Server response packet send back to Desktop Client include line with pr efix 00 + process's hash
		And Srver mark to block or allow action by 1 (allow) or 2 (deny) 3 (UNKNOWN)
		And db statuses are represents by given `named` enum flags (can be changed by admin) :
		| name    | number | describe                                                                  |
		| UNKNOWN | 0      | is new and saved to process list, admin should decide and mark process    |
		| ALLOW   | 1      | allow by admin                                                            |
		| DENY    | 2      | deny by admin                                                             |

		And there is presist process policy hash list with:
		| hash                  | status |
		| TEST_HASH_EXIST_DENY  | 2      |
		| TEST_HASH_EXIST_ALLOW | 1      |

		And there is defined requests types:
		| name                   | value  |
		| REQUEST_CHECK_HASH     | 0      |
		| REQUEST_ADMIN_HELP     | 1      |
		| REQUEST_SET_PERMISSION | 2      |

	Scenario: Process exists in db and should be deny by setup status
		Given process chalange with hash "TEST_HASH_EXIST_DENY"
		And process has status "DENY" in db
		Then Server should send back packet to Desktop Client with "00TEST_HASH_EXIST_DENY2"

	Scenario: Process exists in db and should be allow by setup status
		Given process chalange with hash "TEST_HASH_EXIST_ALLOW"
		And process has status "ALLOW" in db
		Then Server should send back packet to Desktop Client with "00TEST_HASH_EXIST_ALLOW1"

	Scenario: Process is new and should be set as unknown process
		Given process chalange with hash "TEST_HASH_UNKNOWN"
		And no exists in db
		Then server should save process with status "UNKNOWN" in db
		And send back packet "00TEST_HASH_UNKNOWN0"

	Scenario: Setup new process in db by "REQUEST_SET_PERMISSION" from desktop client
		Given process is requested with hash "TEST_HASH_FROM_DESKTOP"
		And request type is "REQUEST_SET_PERMISSION" by numeric eq "2"
		And permission value is "ALLOW"
		Then server check if this process exists in db, update the permissions value
		And crate process permissions with recived value when dont exists
		And sendback confirmation packet with value "00TEST_HASH_FROM_DESKTOP1"

	Scenario: Log down client activity "REQUEST_ADMIN_HELP" to the db from desktop client by mock
	Given process is requested with hash "TEST_HASH_FROM_DESKTOP"
	And sendback confirmation packet with value "00TEST_HASH_FROM_DESKTOP10"


