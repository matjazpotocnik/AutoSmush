# AutoSmush

Optimize/compress images automatically on upload, resize and crop, manually by clicking the button
or link for each image or variation, and in bulk mode for all images sitewide.

In **Automatic mode** images are automatically optimized, with no user intevention required.
Variations of images that are created on resize/crop and admin thumbnails can also be automatically
optimized.

In **Manual mode** a separate button/link is added for optimizing a specific image or image
variation. For those who prefer more control.

In **Bulk mode** all images, all variations or both can be optimized in one click.

Each of the modes has his own set of options.

### Automatic mode
Before any magic happen, you have to select **actions**:

- **Optimize on upload:**
Every uploaded image is optimized automatically.
- **Preserve original:**
Uploaded image is saved with .autosmush extension before it is optimized. When original image is
deleted, backup is also deleted. This action is only active, if Optimize on upload is checked.
- **Optimize variations:**
Images that are cropped/resized (variations) are optimized automatically. Admin thumbnails are also
optimized.
- **Optimize variationsCI3:**
Images that are cropped/resized using CroppableImage3 are automatically optimized. This action is
only available, if you have installed FieldtypeCroppableImage3 module.

### Manual mode
A button or a link is added to the page edit and/or variations modal:

- **Add button/link to image edit page:**
When you edit a page that has an image field, a link or a button (depending on Processwire version)
will be added to allow you to optimize individual image.
- **Add button to variations modal:**
When you edit a page that has an image field, and you click on variations link/button, modal is
opened showing all variations of original image. Here, a button is added so you can optimize
selected variations.

### Bulk mode
All images and/or all variations can be optimized in one click. If you are using local tools as
optimizing engine, be aware that this is cpu consuming operation. Will process images sitewide, use
with caution! If you have a lot of images, this process make take some time, so have a beer or two
nearby :-)

- **Optimize originals:**
Optimize uploaded images.
- **Optimize variations**
Optimized cropped/resized images (variations).

### Engines
Currently there are two methods available to optimize the image:

- **reShmush.it online service**
It's a free (at the moment) thirda part tool that provides an online way to optimize images. This
tool is based on several well-known algorithms such as pngquant, jpegoptim, optipng. After you
upload the image to your web server, it is then uploaded to the reSmush.it web server where it is
processed and then optimized image is downloaded. It takes time for all this uploading/downloading
to finish, sit & wait :) There is a 5 MB file upload limit and no limit on number of uploaded
images. I don't suggest it for processing private material.
- **local tools**
Images are processed locally by [Image Optimizer](https://github.com/psliwa/image-optimizer), a
bundled PHP library that, in turn, uses executables on your web server for optimizing images:
pngquant, pngcrush, pngout, advpng, gifsicle, jpegoptim, jpegtran. Autosmush is using just three:
jpegoptim for jpgs, optipng for pngs and gifsicle for gifs. Images are thus processed on the web
server and are not uploaded to some online service. Binaries for Windows are provided with this
module in windows_binaries folder, on unix system the binaries can be installed using apt-get
install command or by building it from sources: [jpegoptim][1], [optipng][2], [gifsicle][3].
You need PHP with enabled/allowed exec() function. In shared environments this function is mostly
disabled/forbidden if php runs as a module, but is allowed if php is running as (fast)CGI.

### Compression level
Image compression level can be set in **JPG quality** setting. It's applied to reSmush.it (for all
image types) and jpegoptim (for jpg's only). A low compression level will result in a smaller
filesize but image quality will be lower. Values between 75 and 95 are common. Enter 100 for
lossless optimization. EXIF data is preserved for jpegoptim.

### Installation
Copy the files to the /site/modules/AutoSmush folder, log in to your ProcessWire admin and go to the
Modules page. Click the Refresh button and then Install.

Installing this module creates /site/assets/autosmush folder, it's deleted on uninstall. The folder
should be writable by the user running the web server. Log file is at /site/logs/autosmush.txt

### License
Copyright (c) 2016 Roland Toth and Matja&#382; Poto&#269;nik  
Github: https://github.com/matjazpotocnik/AutoSmush  
Support: https://processwire.com/talk/topic/14818-auto-smush/

Licensed under the MIT license. See the LICENSE file for details.

http://freecode.com/projects/jpegoptim/
http://optipng.sourceforge.net/
http://www.lcdf.org/gifsicle/
