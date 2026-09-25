ENV_FILE=.env
PYTHON=/venv/bin/python

copyEnv:
	cp ".env.$(ENV)" $(ENV_FILE)

freshInstall:
	rm -rf node_modules bun.lock
	bun install

deploy:
	make ENV=production copyEnv
	docker-compose down && docker-compose build && docker-compose up -d