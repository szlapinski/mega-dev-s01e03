# S01E03 submission

The `support-kb/` directory is a working copy of the supplied KB export. The original ZIP and
its extracted reference copy remain outside this directory.

The added page is `support-kb/src/routes/kb/incidents/4471-subject-split/+page.svx`. It follows
the accepted normalized-subject rule, computes its report counts from the export, and keeps the
classifier's technical-cause counts visible as separate diagnostic evidence.

The twelve GitHub issues use the same normalized subjects. Each issue states the number of
unique reports it covers from #4471. The source snapshot contains 412 unique report IDs.

The export does not include a package manifest or a build configuration. This copy has not been
represented as a rendered Svelte/SVX build.
