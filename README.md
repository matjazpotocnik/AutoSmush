# AutoSmush

Optimize/compress images automatically on upload, resize and crop, 
manually by clicking the button or link for each image or variation, and
in bulk mode for all images sitewide.

In **Automatic mode** images that are uploaded can be automatically optimized.
Variations of images that are created on resize/crop and admin thumbnails
can also be automatically optimized.

In **Manual mode** "Optimize image" link/button will be present. This allows
manual optimization of the individual image or variation.

In **Bulk mode** all images, all variations or both can be optimized in
one click. Will process images sitewide, use with caution! This may take a
while to finish, especially if you are using online service - grab a coffee :-)

Each of the modes has his own set of options. There are two **Engines**
available to optimize images:

- **reShmush.it online service**
It's a free (at the moment) tool that provides an online way to optimize images.
This tool is based on several well-known algorithms such as pngquant, jpegoptim,
optipng. Image is uploaded to the reSmush.it web server, then optimized image is
downloaded. There is a 5 MB file upload limit and no limit on number of uploaded
images.
- **local tools**
Local tools is set of executables on this web server for optimizing images:
optipng, pngquant, pngcrush, pngout, advpng, gifsicle, jpegoptim, jpegtran.
Images are thus processed on the web server and are not uploaded to some online
service. Binaries for Windows are provided with this module in windows_binaries
folder. Copy the binaries somewhere on the PATH environment variable eg. to
C:\Windows.

Select **Actions** to define which images will be optimized: originals and/or
variations.

Image compression level can be set in **JPG quality** setting. It's applyed to
reSmush.it and jpegoptim. A low compression level will result in a smaller
filesize but image quality will be lower. Values between 75 and 95 are common.
Enter 100 for lossless optimization. EXIF data is preserved.

### Installation
Copy the files to the /site/modules/AutoSmush folder, log in to your ProcessWire
admin and go to the Modules page. Click the Refresh button and then Install.

Installing this module creates /site/assets/autosmush folder, it's deleted on 
uninstall. The folder should be writable by the user running the web server. Log 
file is at /site/logs/autosmush.txt

### License
Copyright (c) 2016 Roland Toth.  
Mods by Matja&zcaron; Poto&ccaron;nik (https://github.com/matjazpotocnik/AutoSmush).  
Support forum: https://processwire.com/talk/topic/todo/

Licensed under the MIT license. See the LICENSE file for details.
