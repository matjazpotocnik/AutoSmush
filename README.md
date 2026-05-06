# AutoSmush

Optimize/compress images automatically on upload, resize and crop, manually by clicking the button or link for each image or variation, and in bulk mode for all images sitewide.

In **Automatic Mode in Admin (backend)**, images are automatically optimized on upload, with no user intervention required. Variations created on resize/crop and admin thumbnails can also be optimized automatically.

In **Automatic Mode in Templates (frontend API)**, images are optimized when you call image-specific methods in template files.

In **Manual mode**, a separate button/link is added so you can optimize a specific image or image variation when needed.

In **Bulk mode**, all images, all variations or both can be optimized in one click.

Each mode has its own set of options.

### Automatic Mode in Admin (backend)
Before any optimization happens, select the relevant **actions**:

- **Optimize on upload:** Every uploaded image is optimized automatically.

- **Preserve original:** The uploaded image is saved with a `.autosmush` extension before optimization. When the original image is deleted, the backup is also deleted. This action is active only when **Optimize on upload** is enabled.

- **Optimize variations:** Cropped/resized images (variations) are optimized automatically. Admin thumbnails are also optimized.

- **Optimize variationsCI3:** Images cropped/resized with CroppableImage3 are optimized automatically. This action is available only if the `FieldtypeCroppableImage3` module is installed.

### Automatic Mode in Templates (frontend API)
Before any optimization happens, select the relevant **actions**:

- **Optimize on Pageimage->url():** *EXPERIMENTAL* A variation is created and served when the `url()` method is used, e.g. `echo $page->images->first()->url` returns `/site/assets/files/1234/myfile.-autosmush.jpg`.

- **Optimize on Pageimage->add():** The image is optimized when you call the `add()` method, e.g. `$page->images->add("/path/to/file")`.

- **Optimize on Pageimage->size()/width()/height()/crop():** The image is optimized when resized by any method that calls `ImageSizer::resize()`.

### Manual mode
A button or a link is added to the page edit and/or variations modal:

- **Add button/link to image edit page:** When you edit a page with an image field, a link or button (depending on ProcessWire version) is added so you can optimize an individual image.

- **Add button to variations modal:** When you edit a page with an image field and click the variations link/button, a modal opens showing all variations of the original image. A button is added there so you can optimize selected variations.

### Bulk mode
All images and/or all variations can be optimized in one click. This processes images sitewide, so use with caution. If you have many images, the process may take some time.

- **Optimize originals:** Optimize uploaded images.

- **Optimize variations:** Optimize cropped/resized images (variations).

### Engines
Currently, there are two methods available to optimize images:

- **reShmush.it online service**: A free third-party service for online image optimization. It uses several well-known algorithms such as pngquant, jpegoptim, and optipng. After an image is uploaded to your web server, it is uploaded again to reSmush.it for processing, then the optimized image is downloaded back. Large images may take longer because of upload/download time. There is a 5 MB upload limit per file and no limit on the number of uploaded images. It is not recommended for private or sensitive material.

- **web server optimizers**: Images are processed by [Image Optimizer](https://github.com/psliwa/image-optimizer), a bundled PHP library that uses executables on your web server: jpegoptim and jpegtran for JPG, pngquant/pngcrush/pngout/advpng for PNG, gifsicle for GIF, and svgo for SVG. Images stay on your web server and are not uploaded to an external service. See the installation section for details.

### Compression level
The image compression level can be set in the **JPG quality** setting. It applies to reSmush.it (for all supported image types) and jpegoptim (for JPG only). A lower quality value results in a smaller file size but also lower image quality. Values between 75 and 95 are common. Enter 100 for lossless optimization. EXIF data is preserved where possible (at least for jpegoptim and reSmush.it).

### Advanced options for server tools
Here you can see the paths where optimizers are searched for. A table of available optimizers is also displayed. You can enable **Optimizers chaining**. If this option is unchecked (default), only the first available optimizer runs. If checked, all available optimizers run one after another.

### Installation
Copy the files to `/site/modules/AutoSmush`, log in to ProcessWire admin, open the Modules page, click **Refresh**, and then click **Install**.

Installing this module creates `/site/assets/autosmush`, which is deleted on uninstall. The folder must be writable by the web server user. The log file is `/site/logs/autosmush.txt`.

When using **server tools**, you must install image optimizer executables. AutoSmush searches for them in the `PATH` environment variable, the ProcessWire root directory, the site's templates directory, and the site's assets directory. Windows binaries (except svgo) are bundled in the `windows_binaries` folder and are detected automatically, so no special installation is required on Windows. On Unix systems, at least the basic binaries can be installed with `sudo apt-get install jpegoptim optipng gifsicle`, or built from source: [jpegoptim][1], [optipng][2], [gifsicle][3]. You also need PHP with `exec()` enabled. In shared hosting environments, `exec()` is often disabled when PHP runs as a module, but may be allowed when PHP runs as (Fast)CGI.

### License
Copyright (c) 2016-2019 Roland Toth and Matjaž Potočnik.  
Github: https://github.com/matjazpotocnik/AutoSmush  
Support: https://processwire.com/talk/topic/14818-auto-smush/

Licensed under the MIT license. See the LICENSE file for details.

[1]: http://freecode.com/projects/jpegoptim/
[2]: http://optipng.sourceforge.net/
[3]: http://www.lcdf.org/gifsicle/
