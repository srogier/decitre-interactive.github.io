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

\Tinify\setKey($_ENV['TINYPNG_API_KEY']);
$source = \Tinify\fromFile($image);

list($basename, $extension) = explode('.', basename($image));
$dirname = dirname($image);

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

$outputImage = <<<HTML

<!--- code à copier dans le blog post -->

<picture>
    <source srcset="/%ratio_2% 2x">
    <img src="/%ratio_1%" width="%width%" height="%height%">
</picture>

<!--- fin -->

HTML;

echo strtr($outputImage, [
    '%ratio_1%' => $imagesByRatio[1],
    '%ratio_2%' => $imagesByRatio[2],
    '%width%' => $outputWidth,
    '%height%' => $outputHeight,
]);
