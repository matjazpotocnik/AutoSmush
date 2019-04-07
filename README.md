# AutoSmush

Optimize/compress images automatically on upload, resize and crop, manually by clicking the button or link for each image or variation, and in bulk mode for all images sitewide.

In **Automatic Mode in Admin (backend)** images are automatically optimized on upload, with no user intervention required. Variations of images that are created on resize/crop and admin thumbnails can also be automatically optimized.

In **Automatic Mode in Templates (frontend API)** images are optimized when calling images specific methods in the templates files.

In **Manual mode**, a separate button/link is added for optimizing a specific image or image variation. For those who prefer more control.

In **Bulk mode**, all images, all variations or both can be optimized in one click.

Each of the modes has his own set of options.

### Automatic Mode in Admin (backend)
Before any magic happens, you have to select **actions**:

- **Optimize on upload:** Every uploaded image is optimized automatically.

- **Preserve original:** Uploaded image is saved with .autosmush extension before it is optimized. When the original image is deleted, backup is also deleted. This action is only active if Optimize on upload is checked.

- **Optimize variations:** Images that are cropped/resized (variations) are optimized automatically. Admin thumbnails are also optimized.

- **Optimize variationsCI3:** Images that are cropped/resized using CroppableImage3 are automatically optimized. This action is only available if you have installed FieldtypeCroppableImage3 module.

### Automatic Mode in Templates (frontend API)
Before any magic happens, you have to select **actions**:

- **Optimize on Pageimage->url():** *EXPERIMENTAL* Variation is created and served when url() method is used, eg. `echo $page->images->first()->url` would echo `/site/assets/files/1234/myfile.-autosmush.jpg`

- **Optimize on Pageimage->add():** Image is optimized when you call add() method, eg. `$page->images->add("/path/to/file")`. 

- **Optimize on Pageimage->size()/width()/height()/crop():** Image is optimized when it's resized with any methods that calls ImageSizer::resize().

### Manual mode
A button or a link is added to the page edit and/or variations modal:

- **Add button/link to image edit page:** When you edit a page that has an image field, a link or a button (depending on Processwire version) will be added to allow you to optimize an individual image.

- **Add button to variations modal:** When you edit a page that has an image field, and you click on variations link/button, modal is opened showing all variations of the original image. Here, a button is added so you can optimize selected variations.

### Bulk mode
All images and/or all variations can be optimized in one click. Will process images sitewide, use with caution! If you have a lot of images, this process make take some time, so have a beer or two nearby :-)

- **Optimize originals:** Optimize uploaded images.

- **Optimize variations** Optimized cropped/resized images (variations).

### Engines
Currently, there are two methods available to optimize the image:

- **reShmush.it online service**: It's a free (at the moment) third-party tool that provides an online way to optimize images. This tool is based on several well-known algorithms such as pngquant, jpegoptim, optipng. After you upload the image to your webserver, it is then uploaded to the reSmush.it web server where it is processed and then optimized image is downloaded. It takes time for all this uploading/downloading to finish if your images are large. There is a 5 MB file upload limit and no limit on the number of uploaded images. I don't suggest it for processing private material.

- **web server optimizers**: Images are processed by [Image Optimizer](https://github.com/psliwa/image-optimizer), a bundled PHP library that, in turn, uses executables on your web server for optimizing images: jpegoptim and jpegtran for jpgs, pngquant, pngcrush, pngout and advpng for pngs, gifsicle for gifs and svgo for svgs. Images are thus processed on the web server and are not uploaded to some online service. Read the installation section for more info.

### Compression level
The image compression level can be set in **JPG quality** setting. It's applied to reSmush.it (for all image types) and jpegoptim (for jpg's only). A low compression level will result in a smaller file size but image quality will be lower. Values between 75 and 95 are common. Enter 100 for lossless optimization. EXIF data is preserved where possible (at least for jpegoptim and reSmush.it).

### Advanced options for server tools
Here you can see the path where optimizers are searched for. Table showing available optimizers is also displayed. You can also enable **Optimizers chaining**. If this option is unchecked, only the first available optimizer will run (default). If checked, all available optimizers will run one after another.

### Installation
Copy the files to the /site/modules/AutoSmush folder, log in to your ProcessWire admin and go to the Modules page. Click the Refresh button and then Install.

Installing this module creates /site/assets/autosmush folder, it's deleted on uninstall. The folder should be writable by the user running the web server. The log file is at /site/logs/autosmush.txt

When using **server tools**, you must install optimizers (executables that optimizes images). They are searched for in the PATH environment variable and also in the root directory of ProcessWire installation, in the site's templates directory and in the site's assets directory. Binaries for Windows (except svgo) are provided with this module in windows_binaries folder and they are automatically found, so no special installation is needed. On Unix system at least the "basic" binaries can be installed by running *sudo apt-get install jpegoptim optipng gifsicle* command in the shell or by building them from sources: [jpegoptim][1], [optipng][2], [gifsicle][3]. You also need PHP with enabled/allowed exec() function. In shared environments, this function is mostly disabled/forbidden if php runs as a module, but it's allowed if php is running as (fast)CGI.

### License
Copyright (c) 2016-2019 Roland Toth and Matja&#382; Poto&#269;nik.  
Github: https://github.com/matjazpotocnik/AutoSmush  
Support: https://processwire.com/talk/topic/14818-auto-smush/

Licensed under the MIT license. See the LICENSE file for details.

[1]: http://freecode.com/projects/jpegoptim/
[2]: http://optipng.sourceforge.net/
[3]: http://www.lcdf.org/gifsicle/
