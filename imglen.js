(function($){
  
    $.fn.imglen = function(options) {  
        var defaults = {
            lensSize: 100,
            borderSize: 4,
            borderColor: "#888",
            lensCss: 'the-lens',
            addInset: false,
            addShadow: false,
            Inset: 'null',
            Shadow: 'null',
        };

        var options = $.extend(defaults, options);

        if (options.addInset == true){
            options.Inset = 'webkit-box-shadow: inset 1px 0px 31px 2px rgba(0,0,0,0.75); -moz-box-shadow: inset 1px 0px 31px 2px rgba(0,0,0,0.75); box-shadow: inset 1px 0px 31px 2px rgba(0,0,0,0.75);';
        }

        if (options.addShadow == true){
            options.Shadow = '-webkit-box-shadow: 1px 0px 31px 2px rgba(0,0,0,0.75);-moz-box-shadow: 1px 0px 31px 2px rgba(0,0,0,0.75);box-shadow: 1px 0px 31px 2px rgba(0,0,0,0.75);';
        }

        var lensStyle = "background-position: 0px 0px;width: " + String(options.lensSize) + "px;height: " + String(options.lensSize)
            + "px;float: left;display: none;border-radius: " + String(options.lensSize / 2 + options.borderSize)
            + "px;border: " + String(options.borderSize) + "px solid " + options.borderColor
            + ";background-repeat: no-repeat;position: absolute; cursor: none;" + options.Inset + options.Shadow;

        var $element = $(".imglen.element");
        if(!$element[0]) {
            $element = $("<div></div>").attr("class", "imglen element");
            $element.appendTo($("body"));
        }

        var $targets = $(".imglen.targets");
        if(!$targets[0]) {
            $targets = $("<div></div>").attr("class", "imglen targets");
            $targets.appendTo($element);
        }

        var $imgs = $(".imglen.imgs");
        if(!$imgs[0]) {
            $imgs = $("<div></div>").attr("class", "imglen imgs");
            $imgs.appendTo($element);
        }
		

        return this.each(function () {
            var obj = $(this);
			
			if(obj.is("img")) {
				if(obj.data("$img") == null) {  //use data to save and judge

					var $img = $("<img />").attr("class", "imglen img").css("display", "none");
					$img.appendTo($imgs);
					var imageSrc = options.imageSrc ? options.imageSrc : obj.attr("src");
					$img.attr("src", imageSrc);
					obj.data("$img", $img);
					obj.addClass("imglen");
				} else {
					return;
				}

				if(obj.data("$target") == null) {
					var $target = $("<div></div>").attr("class", "imglen target");

					$target.attr("style", lensStyle);
					$target.css({ "z-index": 1314 });
					$target.css({ backgroundImage: "url('" + obj.data("$img").attr("src") + "')" });
					$targets.append($target);
					obj.data("$target", $target);
				}

				if(obj.data("width-ration") == null || obj.data("height-ration") == null) {
					obj.data("$img").load(function () {
						var widthRatio = $(this).width() / obj.width() || 0;
						var heightRatio = $(this).height() / obj.height() || 0;

						obj.data("width-ration", widthRatio);
						obj.data("height-ration", heightRatio);
					});
				}


				obj.on("mouseover mousemove mouseout mouseleave", setPosition);
				obj.data("$target").on("mouseover mousemove mouseout mouseleave", setPosition);
		

				function setPosition(e) {
					
					$(".imglen.target").hide();   //hide all

					var widthRatio = obj.data("width-ration");
					var heightRatio = obj.data("height-ration");

					var $target = obj.data("$target");
					var offset = obj.offset();

					var leftPos = parseInt(e.pageX - offset.left);
					var topPos = parseInt(e.pageY - offset.top);

					if (leftPos < 0 || topPos < 0 || leftPos > obj.width() || topPos > obj.height()) {
						$target.hide();
					}
					else {
						$target.show();
						leftPos = String(((e.pageX - offset.left) * widthRatio - $target.width() / 2) * (-1));
						topPos = String(((e.pageY - offset.top) * heightRatio - $target.height() / 2) * (-1));
						$target.css({ backgroundPosition: leftPos + 'px ' + topPos + 'px' });

						leftPos = String(e.pageX - $target.width() / 2);
						topPos = String(e.pageY - $target.height() / 2);
						$target.css({ left: leftPos + 'px', top: topPos + 'px' });
					}
				}
			}

           
        });
    }

   
})(jQuery);