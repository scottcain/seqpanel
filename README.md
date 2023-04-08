## Install

     $ npm install --save @gmod/genericseqpanel

## Usage

This React component creates a div containing highlighted FASTA DNA sequence. It uses as its input materials an NCList (i.e., a JBrowse 1 GFF3 formated dataset) anda bgzip, faidx indexed FASTA file.  It addition to those data sources, the component must also be supplied these items about the location:

* the name of the reference sequence (eg, "Chr1")
* the start and end coordinates (technically in interbase coordinates, but since the lookup is going to be an overlaps-type query, the details don't really matter if base versus interbase coordinates are used)
* the name of the gene and transcript for which the highlighted fasta is required
* the "mode" of highlighting required (more on that below)

### Output

<span style="background: rgb(250, 200, 200);">Up/downstream</span><br />
<span style="background: rgb(200, 240, 240);">UTR</span><br />
<span style="background: rgb(220, 220, 180);">Coding</span><br />
Intron<br />
<span style="background: rgb(200, 255, 200);">Genomic (i.e., unprocessed)</span><br />
<span style="background: rgb(220, 160, 220);">Amino acid</span>



## Acknowledgements

I would very much like to thank [Colin Diesh](https://github.com/cmdcolin), who wrote large chunks of the code in this repo while teaching me the ins and outs of the pieces of JBrowse code I wanted to use.

## Academic Use

This package was written with funding from the [NHGRI](http://genome.gov) as part of the [JBrowse](http://jbrowse.org) project. If you use it in an academic project that you publish, please cite the most recent JBrowse paper, which will be linked from [jbrowse.org](http://jbrowse.org).

## License

MIT © [Scott Cain](https://github.com/scottcain)

