.PHONY: wiki
source:
	@cp ./src/__TEMPLATE__.json ./src/$(f).json
wiki:
	@python docs.py --refresh=$(r) --filename=$(f)