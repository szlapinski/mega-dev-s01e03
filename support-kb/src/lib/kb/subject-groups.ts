import {
  causeOf,
  uniqueById,
  type Cause,
  type Report,
  type Tenant,
} from './causes';

export type SubjectGroup = {
  subject: string;
  normalizedSubject: string;
  count: number;
  causeCounts: Record<Cause, number>;
};

export function normalizeSubject(subject: string): string {
  return subject.toLowerCase().replace(/\p{P}/gu, '');
}

export function groupByNormalizedSubject(
  reports: Report[],
  ticket: number,
  tenantOf: (report: Pick<Report, 'tenant'>) => Tenant | undefined,
): SubjectGroup[] {
  const grouped = new Map<string, SubjectGroup>();

  for (const report of uniqueById(reports).filter((row) => row.mergedInto === ticket)) {
    const normalizedSubject = normalizeSubject(report.subject);
    const group = grouped.get(normalizedSubject) ?? {
      subject: report.subject,
      normalizedSubject,
      count: 0,
      causeCounts: { parser: 0, hint: 0 },
    };
    const cause = causeOf(report, tenantOf(report));

    if (cause === null) {
      throw new Error(`Unclassified report: ${report.id}`);
    }

    group.count += 1;
    group.causeCounts[cause] += 1;
    grouped.set(normalizedSubject, group);
  }

  return [...grouped.values()].sort((a, b) =>
    a.normalizedSubject.localeCompare(b.normalizedSubject),
  );
}
