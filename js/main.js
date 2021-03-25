const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const btnCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');

const openModal = () => {
	modalCart.classList.add('show')
};
const closeModal = () => {
	modalCart.classList.remove('show')
};

btnCart.addEventListener('click', openModal);

modalCart.addEventListener('click', (event) => {
	const target = event.target;
	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal()
	}
});

// scroll smooth

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		});
	};
}

// goods

const viewAll = document.querySelectorAll('.view-all');
const navLink = document.querySelectorAll('.navigation-link:not(.view-all)');
const longGoodsList = document.querySelector('.long-goods-list');
const showClothing = document.querySelectorAll('.show-clothing');
const showAccessories = document.querySelectorAll('.show-accessories');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error' + result.status
	} else return await result.json();
};

const createCard = ({
	label,
	name,
	img,
	description,
	id,
	price
}) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6'
	card.innerHTML = `
	<div class="goods-card">

		${label ? `<span class="label">${label}</span>` : ''}

		<img src="db/${img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>
	`;
	return card;
};

const renderCards = (data) => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};
const showAll = (event) => {
	event.preventDefault();
	getGoods().then(renderCards);
};

viewAll.forEach((elem) => {
	elem.addEventListener('click', showAll);
});

const filterCards = (field, value) => {
	getGoods()
		.then((data) => {
			const filtereGoods = data.filter((good) => {
				return good[field] === value
			});
			return filtereGoods;
		})
		.then(renderCards);
};

navLink.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
});

showAccessories.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Accessories');
	});
});
showClothing.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		filterCards('category', 'Clothing');
	});
});
