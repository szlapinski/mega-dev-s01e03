import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { groupByNormalizedSubject } from '../support-kb/src/lib/kb/subject-groups';
import type { Report, Tenant } from '../support-kb/src/lib/kb/causes';

const data = new URL(
  '../support-kb/src/lib/data/',
  import.meta.url,
);
const reports: Report[] = JSON.parse(
  readFileSync(new URL('reports-4471.json', data), 'utf8'),
);
const tenantDirectory = new URL('tenants/', data);
const tenants = new Map<string, Tenant>(
  readdirSync(tenantDirectory).map((file) => {
    const tenant: Tenant = JSON.parse(
      readFileSync(new URL(file, tenantDirectory), 'utf8'),
    );
    return [tenant.handle, tenant];
  }),
);
const groups = groupByNormalizedSubject(reports, 4471, ({ tenant }) =>
  tenants.get(tenant),
);

describe('S01E03 subject tickets', () => {
  test('the accepted subject rule yields twelve groups covering 412 unique reports', () => {
    expect(groups.map(({ subject, count }) => [subject, count])).toEqual([
      ['Appointment moved by itself', 32],
      ['Booking on the wrong date', 40],
      ['Booking shows a different day', 10],
      ['Calendar invite is wrong', 28],
      ['Client turned up on the wrong day', 22],
      ['Date is wrong', 34],
      ['Dates mixed up', 26],
      ['Invite came on the wrong day', 50],
      ['Month and day swapped?', 49],
      ['Reminder went out on the wrong day', 37],
      ['Wrong date again', 34],
      ['Wrong day on the invite', 50],
    ]);
    expect(groups.reduce((sum, group) => sum + group.count, 0)).toBe(412);
  });

  test('cause counts stay diagnostic and cover the same reports', () => {
    expect(
      groups.reduce((sum, group) => sum + group.causeCounts.parser, 0),
    ).toBe(379);
    expect(
      groups.reduce((sum, group) => sum + group.causeCounts.hint, 0),
    ).toBe(33);
  });
});
