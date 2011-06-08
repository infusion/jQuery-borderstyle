/**
 * jQuery Border Style
 * Copyright (c) 2010, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Date: 06/19/2010
 *
 * @author Robert Eisele
 * @version 1.0
 *
 * @see http://www.xarg.org/2010/07/my-jquery-playground/
 **/

(function ($) {

	var declaration = {

		css3: {
			xx: 'borderRadius',
			tl: 'borderTopLeftRadius',
			tr: 'borderTopRightRadius',
			br: 'borderBottomRightRadius',
			bl: 'borderBottomLeftRadius'
		},

		webkit: {
			xx: 'WebkitBorderRadius',
			tl: 'WebkitBorderTopLeftRadius',
			tr: 'WebkitBorderTopRightRadius',
			br: 'WebkitBorderBottomRightRadius',
			bl: 'WebkitBorderBottomLeftRadius'
		},

		gecko: {
			xx: 'MozBorderRadius',
			tl: 'MozBorderRadiusTopleft',
			tr: 'MozBorderRadiusTopright',
			br: 'MozBorderRadiusBottomright',
			bl: 'MozBorderRadiusBottomleft'
		}
	};

	var radii = {
		tr:0,
		tl:0,
		br:0,
		bl:0
	};
	var unit = "px";

	Object.prototype.excludeLargestAmmount = function(threshold) {

		if (typeof threshold == "undefined") {
			threshold = 2;
		}

		var ret = [];
		var tmp = [];
		var max = 0;
		var val = 0;

		for (var i in this) {

			if (typeof(tmp[this[i]]) == "undefined") {
				tmp[this[i]] = 1;
			} else {
				tmp[this[i]]++;
			}
			if (tmp[this[i]] > max) {
				val = this[i];
				max = tmp[val];
			}
		}

		if (max < threshold) {
			return null;
		}

		for (var i in this) {
			if (this[i] == val) {
				delete this[i];
			}
		}
		return val;
	}

	$.fn.borderStyle = function (param) {

		function _parse(str) {

			var state = 0;
			var start =-1;
			var key = null;

			var ret = {};

			// shorter
			str = str.replace(/[ \t\n\r]/g, "");

			for (var i = 0, l = str.length; i < l; i++) {

				var c = str.charAt(i);

				switch (c) {
					case ":":
						if (0 === state && -1 !== start) {
							key = str.substring(start, i);
							start =-1;
							state = 1;
							break;
						}
						return false;

					case ",":
					case ";":
						if (1 === state && -1 !== start) {
							ret[key] = str.substring(start, i);
							key = null;
							start =-1;
							state = 0;
							break;
						}
						return false;

					default:
						if (-1 === start) {
							start = i;
						}
				}
			}

			if (null !== key) {
				if (-1 === start) {
					return false;
				}
				ret[key] = str.substring(start, l);
			}
			return ret;
		}

		switch (typeof param) {

			case "undefined":

				var style = this[0].style;

				function _rename(old) {
					return old.replace(/([A-Z])/g, "-$1").toLowerCase();
				}

				var num, ret = "", tmp = {
					tl: radii.tl,
					tr: radii.tr,
					bl: radii.bl,
					br: radii.br
				};

				if (null !== (num = tmp.excludeLargestAmmount())) {
					ret+= _rename(declaration.css3.xx) + ": " + num + unit + ";\n";
					ret+= _rename(declaration.gecko.xx) + ": " + num + unit + ";\n";
					ret+= _rename(declaration.webkit.xx) + ": " + num + unit + ";\n";
				}

				for (var i in tmp) {
					if ("function" !== typeof tmp[i]) {
						ret+= _rename(declaration.css3[i]) + ": " + tmp[i] + unit + ";\n";
						ret+= _rename(declaration.gecko[i]) + ": " + tmp[i] + unit + ";\n";
						ret+= _rename(declaration.webkit[i]) + ": " + tmp[i] + unit + ";\n";
					}
				}

				if (style.border !== undefined && style.border !== "") {
					ret+= "border: " + style.border + ";";
				}
				return ret;


			case "string":
				if (false === (param =_parse(param))) {
					return false;
				}
			case "object":
				break;

			case "number":
				param = {
					topLeftRadius: param,
					topRightRadius: param,
					bottomLeftRadius: param,
					bottomRightRadius: param
				};
				break;

			default:
				return false;
		}


		function _rinit(p, v) {

			if (p[v] !== undefined) {
				return parseInt(p[v], 10);
			}
			if (p.normalRadius !== undefined) {
				return parseInt(p.normalRadius, 10);
			}
			return 0;
		}

		radii = {
			tl: _rinit(param, "topLeftRadius"),
			tr: _rinit(param, "topRightRadius"),
			bl: _rinit(param, "bottomLeftRadius"),
			br: _rinit(param, "bottomRightRadius")
		};
		unit = param.unit || "px";

		var num, styles = {}, tmp = {
			tl: radii.tl,
			tr: radii.tr,
			bl: radii.bl,
			br: radii.br
		};

		if (param.color !== undefined) {
			styles.borderColor = param.color;
		}

		if (param.style !== undefined) {
			styles.borderStyle = param.style;
		}

		if (param.width !== undefined) {
			styles.borderWidth = param.style + unit;
		}

		if (null !== (num = tmp.excludeLargestAmmount())) {
			styles[declaration.css3.xx] = num + unit;
			styles[declaration.gecko.xx] = num + unit;
			styles[declaration.webkit.xx] = num + unit;
		}

		for (var i in tmp) {
			if ("function" !== typeof tmp[i]) {
				styles[declaration.css3[i]] = tmp[i] + unit;
				styles[declaration.gecko[i]] = tmp[i] + unit;
				styles[declaration.webkit[i]] = tmp[i] + unit;
			}
		}

		return this.each(function () {
			$(this).css(styles);
		});
	}

})(jQuery);
