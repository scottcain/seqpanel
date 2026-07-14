import { expect, test } from "vitest";
import { gff3RegionToTranscripts } from "./gff3ToSimpleFeature";

const gff3Fixture = `##gff-version 3
chr1\tSGD\tgene\t101\t500\t.\t-\t.\tID=gene1;Name=TESTGENE
chr1\tSGD\tmRNA\t101\t500\t.\t-\t.\tID=mRNA1;Name=TESTGENE-mRNA;Parent=gene1
chr1\tSGD\tCDS\t151\t300\t.\t-\t0\tID=cds1;Parent=mRNA1
chr1\tSGD\texon\t101\t500\t.\t-\t.\tID=exon1;Parent=mRNA1
chr1\tSGD\tgene\t600\t700\t.\t+\t.\tID=gene2;Name=OTHERGENE
`;

test("finds the matching gene and returns its transcripts as a subfeature tree", () => {
  const transcripts = gff3RegionToTranscripts(gff3Fixture, "TESTGENE");

  expect(transcripts).toHaveLength(1);
  const [mrna] = transcripts;
  expect(mrna.uniqueId).toBe("mRNA1");
  expect(mrna.type).toBe("mRNA");
  expect(mrna.refName).toBe("chr1");
  // GFF3 is 1-based closed; SimpleFeature is 0-based half-open.
  expect(mrna.start).toBe(100);
  expect(mrna.end).toBe(500);
  expect(mrna.strand).toBe(-1);

  const subfeatureTypes = (mrna.subfeatures ?? []).map(f => f.type).sort();
  expect(subfeatureTypes).toEqual(["CDS", "exon"]);
});

test("matches by gene/ID attributes when Name is absent", () => {
  const gff3 = [
    "chr1\tSGD\tgene\t1\t10\t.\t+\t.\tID=YFOO1;gene=FOO",
    "chr1\tSGD\tmRNA\t1\t10\t.\t+\t.\tID=mFOO1;Parent=YFOO1",
  ].join("\n");
  expect(gff3RegionToTranscripts(gff3, "FOO")).toHaveLength(1);
  expect(gff3RegionToTranscripts(gff3, "YFOO1")).toHaveLength(1);
  expect(gff3RegionToTranscripts(gff3, "NOPE")).toEqual([]);
});

test("returns an empty array when no feature matches", () => {
  expect(gff3RegionToTranscripts(gff3Fixture, "NOT_A_GENE")).toEqual([]);
});
