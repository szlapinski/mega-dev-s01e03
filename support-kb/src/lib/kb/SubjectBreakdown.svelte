<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { type Report, uniqueById } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { groupByNormalizedSubject } from '#lib/kb/subject-groups';

  const ticket = 4471;
  const allReports = reports as Report[];
  const merged = uniqueById(allReports).filter((report) => report.mergedInto === ticket);
  const groups = groupByNormalizedSubject(allReports, ticket, tenantOf);
  const parser = groups.reduce((sum, group) => sum + group.causeCounts.parser, 0);
  const hint = groups.reduce((sum, group) => sum + group.causeCounts.hint, 0);
</script>

<p>
  <strong>{merged.length}</strong> unique reports from #{ticket} ·
  <strong>{groups.length}</strong> normalized-subject groups
</p>

<table>
  <thead>
    <tr>
      <th>subject</th>
      <th>reports</th>
      <th>parser</th>
      <th>hint</th>
    </tr>
  </thead>
  <tbody>
    {#each groups as group (group.normalizedSubject)}
      <tr>
        <td>{group.subject}</td>
        <td>{group.count}</td>
        <td>{group.causeCounts.parser}</td>
        <td>{group.causeCounts.hint}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p>
  The executable cause classifier independently places {parser} reports in <code>parser</code>
  and {hint} in <code>hint</code>. These are diagnostic counts, not a replacement grouping rule.
</p>
