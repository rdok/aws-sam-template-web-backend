SHELL := /bin/bash
LOCAL_API_PORT = 3002

############# Development ######################################################
up:
	docker-compose down
	docker-compose up -d --remove-orphans
	docker-compose run --rm aws dynamodb create-table \
		--table-name conversations_table \
		--attribute-definitions AttributeName=id,AttributeType=S \
		--key-schema AttributeName=id,KeyType=HASH \
		--billing-mode PAY_PER_REQUEST \
		--endpoint-url http://db:8000
	make api.up
api.up:
	sam build
	make api.start
api.start:
	sam local start-api \
		--docker-network basawal-api_conversations \
		--port "${LOCAL_API_PORT}" \
		--env-vars env.json
############# End Development ##################################################

############# Test #############################################################
test: node_modules
	npm run test
node_modules:
	npm install
############# End Test #########################################################

############## Database  #######################################################
db.describe:
	aws dynamodb describe-table --table-name conversations_table \
		--endpoint-url http://localhost:8000
############## End Database  ###################################################

############# Depployment ######################################################
deploy: .aws-sam
	make test
	sam deploy
.aws-sam:
	sam build
############# End Depployment ##################################################

############# Etc ##############################################################
invoke.putItemFunction:
	sam local invoke putItemFunction --event events/event-post-item.json
invoke.getAllItemsFunction:
	sam local invoke --profile default getAllItemsFunction --region eu-west-1 \
		--event events/event-get-all-items.json
logs.getAllItemsFunction:
	sam logs -n getAllItemsFunction --stack-name basawal-api-conversations --tail
logs.putputItemFunction:
	sam logs -n putItemFunction --stack-name basawal-api-conversations --tail
############# End Etc ##########################################################
