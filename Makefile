.PHONY: revalidate
revalidate:
	@node --env-file=.env scripts/revalidate.mjs
