export var LZString = (function () {
	function a(a, b) {
		if (!e[a]) {
			e[a] = {};
			for (var c = 0; c < a.length; c++) e[a][a[c]] = c;
		}
		return e[a][b];
	}
	var b = String.fromCharCode,
		c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
		e = {},
		f = function () {
			return new Map();
		};
	if ("undefined" == typeof Map) {
		var g = function () {
			this.data = {};
		};
		(g.prototype.get = function (a) {
			return this.data.hasOwnProperty(a) ? this.data[a] : null;
		}),
			(g.prototype.set = function (a, b) {
				this.data[a] = b;
			}),
			(g.prototype.has = function (a) {
				return this.data.hasOwnProperty(a);
			}),
			(g.prototype["delete"] = function (a) {
				delete this.data[a];
			}),
			(f = function () {
				return new g();
			});
	}
	var h = {
		compressToBase64: function (a) {
			if (null == a) return "";
			var b = h._compress(a, 6, function (a) {
				return c.charAt(a);
			});
			switch (b.length % 4) {
				default:
				case 0:
					return b;
				case 1:
					return b + "===";
				case 2:
					return b + "==";
				case 3:
					return b + "=";
			}
		},
		decompressFromBase64: function (b) {
			return null == b
				? ""
				: "" == b
				? null
				: h._decompress(b.length, 32, function (d) {
						return a(c, b.charAt(d));
				  });
		},
		compressToUTF16: function (a) {
			return null == a
				? ""
				: h._compress(a, 15, function (a) {
						return b(a + 32);
				  }) + " ";
		},
		decompressFromUTF16: function (a) {
			return null == a
				? ""
				: "" == a
				? null
				: h._decompress(a.length, 16384, function (b) {
						return a.charCodeAt(b) - 32;
				  });
		},
		compressToUint8Array: function (a) {
			for (
				var b = h.compress(a),
					c = new Uint8Array(2 * b.length),
					d = 0,
					e = b.length;
				e > d;
				d++
			) {
				var f = b.charCodeAt(d);
				(c[2 * d] = f >>> 8), (c[2 * d + 1] = f % 256);
			}
			return c;
		},
		decompressFromUint8Array: function (a) {
			if (null === a || void 0 === a) return h.decompress(a);
			for (
				var c = new Array(a.length / 2), d = 0, e = c.length;
				e > d;
				d++
			)
				c[d] = 256 * a[2 * d] + a[2 * d + 1];
			var f = [];
			return (
				c.forEach(function (a) {
					f.push(b(a));
				}),
				h.decompress(f.join(""))
			);
		},
		compressToEncodedURIComponent: function (a) {
			return null == a
				? ""
				: h._compress(a, 6, function (a) {
						return d.charAt(a);
				  });
		},
		decompressFromEncodedURIComponent: function (b) {
			return null == b
				? ""
				: "" == b
				? null
				: ((b = b.replace(/ /g, "+")),
				  h._decompress(b.length, 32, function (c) {
						return a(d, b.charAt(c));
				  }));
		},
		compress: function (a) {
			return h._compress(a, 16, function (a) {
				return b(a);
			});
		},
		_compress: function (a, b, c) {
			if (null == a) return "";
			var d,
				e,
				g,
				h = f(),
				i = f(),
				j = "",
				k = "",
				l = "",
				m = 2,
				n = 3,
				o = 2,
				p = [],
				q = 0,
				r = 0;
			for (g = 0; g < a.length; g += 1)
				if (
					((j = a[g]),
					h.has(j) || (h.set(j, n++), i.set(j, !0)),
					(k = l + j),
					h.has(k))
				)
					l = k;
				else {
					if (i.has(l)) {
						if (l.charCodeAt(0) < 256) {
							for (d = 0; o > d; d++)
								(q <<= 1),
									r == b - 1
										? ((r = 0), p.push(c(q)), (q = 0))
										: r++;
							for (e = l.charCodeAt(0), d = 0; 8 > d; d++)
								(q = (q << 1) | (1 & e)),
									r == b - 1
										? ((r = 0), p.push(c(q)), (q = 0))
										: r++,
									(e >>= 1);
						} else {
							for (e = 1, d = 0; o > d; d++)
								(q = (q << 1) | e),
									r == b - 1
										? ((r = 0), p.push(c(q)), (q = 0))
										: r++,
									(e = 0);
							for (e = l.charCodeAt(0), d = 0; 16 > d; d++)
								(q = (q << 1) | (1 & e)),
									r == b - 1
										? ((r = 0), p.push(c(q)), (q = 0))
										: r++,
									(e >>= 1);
						}
						m--,
							0 == m && ((m = Math.pow(2, o)), o++),
							i["delete"](l);
					} else
						for (e = h.get(l), d = 0; o > d; d++)
							(q = (q << 1) | (1 & e)),
								r == b - 1
									? ((r = 0), p.push(c(q)), (q = 0))
									: r++,
								(e >>= 1);
					m--,
						0 == m && ((m = Math.pow(2, o)), o++),
						h.set(k, n++),
						(l = String(j));
				}
			if ("" !== l) {
				if (i.has(l)) {
					if (l.charCodeAt(0) < 256) {
						for (d = 0; o > d; d++)
							(q <<= 1),
								r == b - 1
									? ((r = 0), p.push(c(q)), (q = 0))
									: r++;
						for (e = l.charCodeAt(0), d = 0; 8 > d; d++)
							(q = (q << 1) | (1 & e)),
								r == b - 1
									? ((r = 0), p.push(c(q)), (q = 0))
									: r++,
								(e >>= 1);
					} else {
						for (e = 1, d = 0; o > d; d++)
							(q = (q << 1) | e),
								r == b - 1
									? ((r = 0), p.push(c(q)), (q = 0))
									: r++,
								(e = 0);
						for (e = l.charCodeAt(0), d = 0; 16 > d; d++)
							(q = (q << 1) | (1 & e)),
								r == b - 1
									? ((r = 0), p.push(c(q)), (q = 0))
									: r++,
								(e >>= 1);
					}
					m--, 0 == m && ((m = Math.pow(2, o)), o++), i["delete"](l);
				} else
					for (e = h.get(l), d = 0; o > d; d++)
						(q = (q << 1) | (1 & e)),
							r == b - 1 ? ((r = 0), p.push(c(q)), (q = 0)) : r++,
							(e >>= 1);
				m--, 0 == m && ((m = Math.pow(2, o)), o++);
			}
			for (e = 2, d = 0; o > d; d++)
				(q = (q << 1) | (1 & e)),
					r == b - 1 ? ((r = 0), p.push(c(q)), (q = 0)) : r++,
					(e >>= 1);
			for (;;) {
				if (((q <<= 1), r == b - 1)) {
					p.push(c(q));
					break;
				}
				r++;
			}
			return p.join("");
		},
		decompress: function (a) {
			return null == a
				? ""
				: "" == a
				? null
				: h._decompress(a.length, 32768, function (b) {
						return a.charCodeAt(b);
				  });
		},
		_decompress: function (a, c, d) {
			var e,
				g,
				h,
				i,
				j,
				k,
				l,
				m,
				n = f(),
				o = 4,
				p = 4,
				q = 3,
				r = "",
				s = [],
				t = { val: d(0), position: c, index: 1 };
			for (g = 0; 3 > g; g += 1) n.set(g, g);
			for (i = 0, k = Math.pow(2, 2), l = 1; l != k; )
				(j = t.val & t.position),
					(t.position >>= 1),
					0 == t.position &&
						((t.position = c), (t.val = d(t.index++))),
					(i |= (j > 0 ? 1 : 0) * l),
					(l <<= 1);
			switch ((e = i)) {
				case 0:
					for (i = 0, k = Math.pow(2, 8), l = 1; l != k; )
						(j = t.val & t.position),
							(t.position >>= 1),
							0 == t.position &&
								((t.position = c), (t.val = d(t.index++))),
							(i |= (j > 0 ? 1 : 0) * l),
							(l <<= 1);
					m = b(i);
					break;
				case 1:
					for (i = 0, k = Math.pow(2, 16), l = 1; l != k; )
						(j = t.val & t.position),
							(t.position >>= 1),
							0 == t.position &&
								((t.position = c), (t.val = d(t.index++))),
							(i |= (j > 0 ? 1 : 0) * l),
							(l <<= 1);
					m = b(i);
					break;
				case 2:
					return "";
			}
			for (n.set(3, m), h = m, s.push(m); ; ) {
				if (t.index > a) return "";
				for (i = 0, k = Math.pow(2, q), l = 1; l != k; )
					(j = t.val & t.position),
						(t.position >>= 1),
						0 == t.position &&
							((t.position = c), (t.val = d(t.index++))),
						(i |= (j > 0 ? 1 : 0) * l),
						(l <<= 1);
				switch ((m = i)) {
					case 0:
						for (i = 0, k = Math.pow(2, 8), l = 1; l != k; )
							(j = t.val & t.position),
								(t.position >>= 1),
								0 == t.position &&
									((t.position = c), (t.val = d(t.index++))),
								(i |= (j > 0 ? 1 : 0) * l),
								(l <<= 1);
						n.set(p++, b(i)), (m = p - 1), o--;
						break;
					case 1:
						for (i = 0, k = Math.pow(2, 16), l = 1; l != k; )
							(j = t.val & t.position),
								(t.position >>= 1),
								0 == t.position &&
									((t.position = c), (t.val = d(t.index++))),
								(i |= (j > 0 ? 1 : 0) * l),
								(l <<= 1);
						n.set(p++, b(i)), (m = p - 1), o--;
						break;
					case 2:
						return s.join("");
				}
				if ((0 == o && ((o = Math.pow(2, q)), q++), n.get(m)))
					r = n.get(m);
				else {
					if (m !== p) return null;
					r = h + h[0];
				}
				s.push(r),
					n.set(p++, h + r[0]),
					o--,
					(h = r),
					0 == o && ((o = Math.pow(2, q)), q++);
			}
		},
	};
	return h;
})();
"function" == typeof define && define.amd
	? define(function () {
			return LZString;
	  })
	: "undefined" != typeof module &&
	  null != module &&
	  (module.exports = LZString);
