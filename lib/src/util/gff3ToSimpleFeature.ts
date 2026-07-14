import gff from "@gmod/gff";
import type { GFF3FeatureLineWithRefs } from "@gmod/gff";
import { SimpleFeatureSerialized } from "@jbrowse/core/util/simpleFeature";

// GFF3 attribute keys (in priority order) that a "gene" prop value is
// checked against, since MOD data providers don't agree on which one holds
// the human-readable gene name.
const GENE_MATCH_ATTRIBUTES = ["Name", "gene", "ID"];

function strandToNumber(strand: string | null): number {
  if (strand === "+") {
    return 1;
  }
  if (strand === "-") {
    return -1;
  }
  return 0;
}

function firstAttr(
  attributes: GFF3FeatureLineWithRefs["attributes"],
  key: string,
): string | undefined {
  return attributes?.[key]?.[0];
}

function lineToSimpleFeature(
  line: GFF3FeatureLineWithRefs,
): SimpleFeatureSerialized {
  const uniqueId =
    firstAttr(line.attributes, "ID") ??
    `${line.seq_id}:${line.start}..${line.end}:${line.type}`;

  return {
    uniqueId,
    refName: line.seq_id ?? "",
    start: (line.start ?? 1) - 1,
    end: line.end ?? 0,
    strand: strandToNumber(line.strand),
    type: line.type ?? "",
    source: line.source ?? undefined,
    score: line.score ?? undefined,
    phase: line.phase ?? undefined,
    name: firstAttr(line.attributes, "Name"),
    // A GFF3 "feature" is itself an array of one or more lines sharing an
    // ID (used for discontinuous features); every line carries the same
    // resolved child_features, so any one of them is a complete child list.
    subfeatures: line.child_features.flatMap(childFeature =>
      childFeature.map(lineToSimpleFeature),
    ),
  };
}

function matchesGene(line: GFF3FeatureLineWithRefs, gene: string): boolean {
  return GENE_MATCH_ATTRIBUTES.some(key =>
    line.attributes?.[key]?.includes(gene),
  );
}

/**
 * Parse the raw GFF3 lines covering a queried region and return the
 * subfeatures (e.g. mRNAs) of whichever top-level feature matches `gene`,
 * converted to plain SimpleFeatureSerialized-shaped objects.
 */
export function gff3RegionToTranscripts(
  gff3Text: string,
  gene: string,
): SimpleFeatureSerialized[] {
  const items = gff.parseStringSync(gff3Text, {
    parseSequences: false,
    // The queried region can cut through features that are only partly
    // inside it (e.g. a neighboring gene whose parent line falls outside
    // the window); ignore unresolved Parent/Derives_from references
    // instead of throwing, since only the target gene's own subtree matters
    // here.
    errorCallback: () => undefined,
  });

  for (const feature of items) {
    const match = feature.find(line => matchesGene(line, gene));
    if (match) {
      return match.child_features.flatMap(childFeature =>
        childFeature.map(lineToSimpleFeature),
      );
    }
  }
  return [];
}
