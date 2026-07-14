## Install

     $ npm install --save generic-sequence-panel

## Upgrading to 2.0

Version 2.0 changes the *default* feature-data adapter from NCList to a
tabix-indexed GFF3 file. If you were passing `nclistbaseurl` and
`urltemplate` before, that integration will silently stop fetching feature
data after upgrading unless you also add `adapterType="nclist"` to keep the
old behavior — see [Legacy NCList adapter](#legacy-nclist-adapter). New
integrations should prefer the default and pass `gffurl` instead. See
[CHANGELOG.md](CHANGELOG.md) for the full release history.

## About

This package provides two React components: GenericSeqPanel and
GenericGeneSeqPanel which have similar arguments. The difference between these
two panels is this: GenericSeqPanel provides ONLY the highlighted FASTA given a
gene, transcript and mode. GenericGeneSeqPanel does a little more: you provide a
gene and it gets a list of transcripts of that gene and provides a dropdown menu
for both the transcript and the mode.

The React components create a div containing highlighted FASTA DNA sequence. By
default, feature data is read from a bgzip-compressed, tabix-indexed GFF3 file
(a single sorted `.gff3.gz` + `.gff3.gz.tbi` pair). The legacy NCList adapter
(a JBrowse 1 GFF3-derived dataset) is also available, opt-in, for existing
integrators — see [Legacy NCList adapter](#legacy-nclist-adapter) below.
Sequence data always comes from a bgzip, faidx indexed FASTA file. In addition
to those data sources, the component must also be supplied these items about
the location:

- the name of the reference sequence (eg, "Chr1")
- the start and end coordinates (technically in interbase coordinates, but since
  the lookup is going to be an overlaps-type query, the details don't really
  matter if base versus interbase coordinates are used)
- the name of the gene and transcript (only need for GenericSeqPanel) for which
  the highlighted fasta is required
- the "mode" of highlighting required (more on that below, and also only
  required by GenericSeqPanel)

### More usage details

    <GenericSeqPanel
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      transcript="R12H7.1a.2"
      mode="protein"
      gffurl="https://example.org/data/some-species.sorted.gff3.gz"
      fastaurl="https://example.org/data/some-species.fa.gz"
    />

and

    <GenericGeneSeqPanel
      refseq="chrXVI"
      start={79000}
      end={83000}
      gene="GAL4"
      gffurl="https://s3.amazonaws.com/agrjbrowse/docker/9.1.0/SGD/yeast/GFF_SGD.sorted.gff.gz"
      fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000146045.2_R64_genomic.fna.gz"
    />

Several items here a self explanatory: refseq, start, and end are location
information. The props gene and transcript are the names of the features in the
GFF3 data set. The remaining items are described here:

- mode - this is one of several keys that dictate what the output looks like.
  The options are:
  - genomic - The stretch of sequence from start to end with no special
    highlighting
  - genomic_sequence_updown - The stretch of sequence from start to end with 500
    base pairs of padding on both ends
  - cds - The coding sequence of the mRNA that is the result of in silico
    splicing
  - cdna - The CDS with UTRs added
  - protein - The amino acid sequence that results from the cds in silico
    transcription
  - gene - The genomic sequence from start to end with portions that are UTR and
    coding highlighted
  - gene_collapsed_intron - same as gene, but the introns are compressed to 10
    base pairs at the splice junction and the remainder replaced with ellipses
  - gene_updownstream - same as gene but with 500 bp of up and down stream
    sequence added
  - gene_updownstream_collapsed_intron - same as gene_collapsed_intron but with
    up and downstream padding added
- adapterType - which feature-data adapter to use, `"tabix"` (default) or
  `"nclist"` (legacy, see [below](#legacy-nclist-adapter))
- gffurl - the URL of a sorted, bgzip-compressed GFF3 file (used when
  `adapterType` is `"tabix"`). The `.tbi` index is assumed to live alongside
  it (i.e. at `${gffurl}.tbi`)
- fastaurl - the url to the fasta file. The location of the .fai and .gzi files
  will be assumed from this url

### fetchTranscripts / fetchTranscriptsTabix

This package also provides helper functions that are used internally to get
the subfeature information for a given feature (gene) — `fetchTranscriptsTabix`
for the default tabix-indexed GFF3 adapter, and `fetchTranscripts` for the
legacy NCList adapter. `fetchTranscriptsTabix` takes:

- gffurl: the URL of the bgzip-compressed, tabix-indexed GFF3 file
- refseq: the reference sequence (name, like "chr1")
- start: the start of the range (in interbase coordinates)
- end: the end of the range (in interbase coordinates)
- gene: the name of the gene

and returns an array of JBrowse 2-style feature objects that correspond to the
gene's subfeatures (usually transcripts and their exons, UTRs and CDS regions).
They can be accessed via getter functions like `transcriptArray[0].get('name')`
and `transcriptArray[i].get('start')`, since the underlying JBrowse libraries
handle the mapping between the items in this array and the attributes that
came from the GFF3.

The example below shows the shape returned by the legacy `fetchTranscripts`
(NCList) helper specifically — its compact array encoding is internal to
`@gmod/nclist`. `fetchTranscriptsTabix` instead builds plain nested objects
(`{ uniqueId, refName, start, end, strand, type, subfeatures, ... }`) directly
from the GFF3 attributes, but exposes the same `Feature` getter interface.

```
 [[
  1,
  31097676,                      // start coordinate (interbase coords)
  31169556,                      // end coordinate
  -1,                            // strand
  "ENSEMBL:ENST00000481143.2",   // some sort of id
  "DMD",                         // feature name
  "rna97622",                    // some sort of id
  "ENST00000481143.2",           // another id
  "SO:0000673",                  // Sequence ontology term ID
  "X",                           // reference sequence name
  "ENSEMBL",                     // GFF source?
  [[
    2,                           // subfeature depth?
    31097676,                    // subfeature start
    31098183,                    // subfeature end
    -1,                          // subfeature strand
    "e893041",                   // subfeature name
    "X",                         // subfeature refrence sequence name
    "ENSEMBL",                   // subfeature GFF source
    "exon"                       // subfeature SO term name
   ],
   [
    2,
    31169442,
    31169556,
    -1,
    "e893042",
    "X",
    "ENSEMBL",
    "exon"
  ]],
  "ENSEMBL:ENST00000481143.2",        // another id
  "transcript"                        // SO term name
 ],
 etc
```

An example of how this function is used can be found in the GenericGeneSeqPanel
component:

https://github.com/scottcain/seqpanel/blob/main/lib/src/components/GenericGeneSeqPanel.tsx

### Implementation details

This component makes use of components developed by the JBrowse/GMOD team:

- TabixIndexedFile from "@gmod/tabix" and the parser from "@gmod/gff" - These
  access the bgzip-compressed, tabix-indexed GFF3 file (the default adapter).
  `getLines` does an overlaps-type region query against the `.tbi` index, and
  `@gmod/gff` parses the returned lines into a gene/mRNA/exon/CDS feature
  tree (via the GFF3 `ID`/`Parent` attributes) which is then filtered down to
  the gene and transcripts specified in the props of the component.
- BgzipIndexedFasta from "@gmod/indexedfasta" - This accesses the bgzipped,
  samtools faidx indexed fasta file. The locations of the .fai and .gzi files
  are found by just appending those extensions to the supplied fastaurl.
- SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel" - This
  component takes the feature data from the GFF3 (or NCList) adapter and the
  sequence data from BgzipIndexedFasta and generates the highlighted sequence
  that is controlled by the `mode` prop described above.

#### Legacy NCList adapter

Passing `adapterType="nclist"` restores the original behavior, reading feature
data from a JBrowse 1 NCList data store (a directory of per-chromosome sharded
`trackData.jsonz` files) via NCList from "@gmod/nclist". It does an "overlaps"
query of the NCList data set and returns all genes and their children
(transcripts, exons, etc) that overlap; GenericGeneSeqPanel then filters the
feature set to the gene specified in the props of the component. This mode
requires two additional props instead of `gffurl`:

- nclistbaseurl - the base url for the NCList adapter (basically, it's the
  part before "tracks" in the url)
- urltemplate - the rest of the url that the NCList adapter uses. Typically,
  this will have `{refseq}` in it that will be interpolated with the refseq
  info

```
    <GenericGeneSeqPanel
      adapterType="nclist"
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
    />
```

The `fetchTranscripts` helper is the NCList equivalent of
`fetchTranscriptsTabix`, taking `nclistbaseurl`, `urltemplate`, `refseq`,
`start`, `end`, and `gene`.

#### Places for potential future additions

This component does what I need it to do. Potential improviments include:

- This component assumes all data are remote and accessed via URL. Options for
  local access could be added.
- It also assumes the "standard" genetic code. An option could be added to
  support others.

Pull requests are accepted.

### Output

In this screenshot, the actual output of the GenericGeneSeqPanel component is
shown. The portion that is just the highlighted fasta is what is provided by
GenericSeqPanel, and the rest of the UI (dropdown menus, buttons, and legend)
are provided by GenericGeneSeqPanel.

![Screenshot of sample output showing a few dozen rows of fasta sequence with color highlighting](/img/example_output.png)

###

A simple example implementation (from the app directory in this monorepo) is
running at https://scottcain.github.io/seqpanel/

## Acknowledgements

I would very much like to thank [Colin Diesh](https://github.com/cmdcolin), who
wrote large chunks of the code in this repo while teaching me the ins and outs
of the pieces of JBrowse code I wanted to use.

## Academic Use

This package was written with funding from the [NHGRI](http://genome.gov) as
part of the [JBrowse](http://jbrowse.org) project. If you use it in an academic
project that you publish, please cite the most recent JBrowse paper, which will
be linked from [jbrowse.org](http://jbrowse.org).

## License

MIT © [Scott Cain](https://github.com/scottcain)
