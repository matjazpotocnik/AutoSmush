# AutoSmush

Automatically optimize images on upload/resize/crop. Manual and bulk optimization.

### Optimize method

- **Use reShmush.it online service**
It's a free (at the moment) tool that provides an online way to optimize images.
This tool is based on several well-known algorithms such as pngquant, jpegoptim,
optipng. Image is uploaded to the reSmush.it web server, then optimized image is
downloaded. There is a 5 MB file upload limit and no limit on number of uploaded
images.
- **Use local tools**
Local tools is set of executables on this web server for optimizing images:
optipng, pngquant, pngcrush, pngout, advpng, gifsicle, jpegoptim, jpegtran.
Images are thus processed on the web server and are not uploaded to some online
service. Binaries for Windows are provided with this module in windows_binaries
folder. Copy the binaries somewhere on the PATH environment variable eg. to
C:\Windows.

### Optimize mode

- **Optimize originals**
Images that are uploaded are automatically optimized based on optimize method.
- **Optimize variations**
Resized/cropped images and admin thumbnails (variations) are optimized. Note
that resized/cropped images and thumbnails are already "optimized", check
/wire/config.php for $config->imageSizerOptions and $config->adminThumbOptions.
Some prefer uploading images with 100% quality and then serving variations with
required dimension/compression.

### Allow manual image optimization
If checked, optimize link/button will be present on page edit. This allows
manual optimization of the image, regardles if automatic optimization is enabled
or not. It will optimize the original image, not variations (no mater what
optimize mode you set).

### Preserve original
If checked, uploaded images (originals) are saved with .autosmush extension, some sort
of backup.

### JPG quality
Set global JPG quality/compression. A low compression level will result in a
smaller filesize but image quality will be lower .Values between 75 and 95 are
common. Enter 100 for lossless optimization. EXIF data is preserved.

### Bulk Optimize
Will process images sitewide, based on the optimize method and mode. USE WITH
CAUTION!!! WARNING: this may take a while to finish, especially if you are using
online service - grab a coffee :-)

### Installation
Copy the files to the /site/modules/AutoSmush folder, log in to your ProcessWire
admin and go to the Modules page. Click the Refresh button and then Install.

Installing this module creates /site/assets/autosmush folder, it's deleted on 
uninstall. The folder should be writable by the user running the web server. Log 
file is at /site/logs/autosmush.txt

### License
Copyright (c) 2016 Roland Toth. Mods by Matja&#x17E; Poto&#x10D;nik.

Licensed under the MIT license. See the LICENSE file for details.
