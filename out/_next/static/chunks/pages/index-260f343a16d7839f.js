(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
	[405],
	{
		8312: function (s, o, n) {
			(window.__NEXT_P = window.__NEXT_P || []).push([
				'/',
				function () {
					return n(6209);
				},
			]);
		},
		6209: function (s, o, n) {
			'use strict';
			n.r(o);
			var t = n(5893),
				e = n(7294),
				i = n(1163);
			o.default = () => {
				let s = (0, i.useRouter)(),
					[o, n] = (0, e.useState)(!1);
				return (0, t.jsxs)('div', {
					id: 'homepage',
					children: [
						(0, t.jsxs)('h1', {
							children: [
								'Welcome on our simulator for the ',
								(0, t.jsx)('br', {}),
								(0, t.jsx)('span', { children: 'project COCOBOTS' }),
							],
						}),
						(0, t.jsx)('img', { src: '/assets/images/logo_cocobots.png', alt: 'Logo of Cocobots' }),
						(0, t.jsx)('button', {
							onClick: () => {
								n(!0), s.push('/simulation/minecraft');
							},
							children: o
								? (0, t.jsx)('img', { src: '/assets/images/loading_horizontal.gif', alt: 'loading' })
								: (0, t.jsx)('span', { children: 'Try it out !' }),
						}),
					],
				});
			};
		},
		1163: function (s, o, n) {
			s.exports = n(9090);
		},
	},
	function (s) {
		s.O(0, [888, 774, 179], function () {
			return s((s.s = 8312));
		}),
			(_N_E = s.O());
	},
]);
