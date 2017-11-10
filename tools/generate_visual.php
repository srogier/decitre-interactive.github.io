<?php

require_once  __DIR__ . '/vendor/autoload.php';

if (count($argv) !== 3) {
    echo "Usage ${argv[0]} 'fichier' 'taille_max' \n";

    exit(1);
}

$image = $argv[1];

if (!file_exists($image)) {
    echo "L'image $image n'existe pas \n";
}

\Tinify\setKey(getenv('TINYPNG_API_KEY'));
$source = \Tinify\fromFile($image);

$imageInfo = pathinfo($image);
$basename = $imageInfo['filename'];
$extension = $imageInfo['extension'];
$dirname = $imageInfo['dirname'];

$imagesByRatio = [];
$ratios = [1,2];
foreach ($ratios as $ratio) {
    $destinationFile = sprintf('%s/%s-%d.%s', $dirname, $basename, $ratio, $extension);

    $size = $argv[2] * $ratio;

    $resized = $source->resize(array(
        "method" => "fit",
        "width" => $size,
        "height" => $size,
    ));
    $resized->toFile($destinationFile);

    $imagesByRatio[$ratio] = $destinationFile;
}

list($outputWidth, $outputHeight) = getimagesize($imagesByRatio[1]);

$imageLight = $source->resize(array(
    "method" => "fit",
    "width" => 30,
    "height" => 30,
));

$outputImage = <<<HTML

<!--- code à copier dans le blog post -->
<figure>
    <img 
        class="lozad" 
        width="%width%" height="%height%"
        src="data:image;base64,%base64_light%"
        data-src="{{ '/%ratio_1%' | prepend: site.baseurl  }}" 
        data-srcset="{{ '/%ratio_1%' | prepend: site.baseurl  }} 1x, {{ '/%ratio_2%' | prepend: site.baseurl  }} 2x" 
    />
    <figcaption>Légende à remplir</figcaption>
</figure>
<!--- fin -->

HTML;

echo strtr($outputImage, [
    '%ratio_1%' => $imagesByRatio[1],
    '%ratio_2%' => $imagesByRatio[2],
    '%width%' => $outputWidth,
    '%height%' => $outputHeight,
    '%base64_light%' => base64_encode($imageLight->toBuffer()),
]);
