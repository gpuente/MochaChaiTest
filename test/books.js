process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Book = require('../app/models/book');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {

	
	beforeEach((done) => {
		Book.remove({}, (err) => {
			done();
		});
	});

	describe('/GET book', () => {
		it('it should GET all the books', (done) => {
			chai.request(server)
				.get('/book')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	describe('/POST book', () => {
		it('it should not a POST a book without pages field', (done) => {
			let book = {
				title: "El psicoanalista",
				author: "John Katzenbach",
				year: 2003
			};
			chai.request(server)
				.post('/book')
				.send(book)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('pages');
					res.body.errors.pages.should.have.property('kind').eql('required');
					done();
				});
		});

		it('it should Post a Book', (done) => {
			let book = {
				title: "El psicoanalista",
				author: "John Katzenbach",
				pages: 722,
				year: 2003
			};
			chai.request(server)
				.post('/book')
				.send(book)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.a('object');
					res.body.should.have.property('message').eql('Book successfully added!');
					res.body.book.should.have.property('title');
					res.body.book.should.have.property('author');
					res.body.book.should.have.property('pages');
					res.body.book.should.have.property('year');
					done();
				});
		});
	});

	
	describe('/GET/:id book', () => {
		it('it should GET a book by the given id', (done) => {
			let book = new Book({
				title: "El psicoanalista",
				author: "John Katzenbach",
				pages: 722,
				year: 2003
			});
			book.save((err, book) => {
				chai.request(server)
				.get('/book/' + book.id)
				.send()
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('author');
					res.body.should.have.property('pages');
					res.body.should.have.property('year');
					res.body.should.have.property('createdAt');
					res.body.should.have.property('_id').eql(book.id);
					done();
				});
			});
		});
	});


	describe('/PUT/:id book', () => {
		it('it should UPDATE a book given the id', (done) => {
			let book = new Book({
				title: "El psicoanalista",
				author: "John Katzenbach",
				pages: 722,
				year: 2003
			});
			book.save((err, book) => {
				chai.request(server)
				.put('/book/' + book.id)
				.send({pages: 735, year: 2001, author: "John K."})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Book updated!');
					res.body.book.should.have.property('title');
					res.body.book.should.have.property('author').eql('John K.');
					res.body.book.should.have.property('pages').eql(735);
					res.body.book.should.have.property('year').eql(2001);
					res.body.book.should.have.property('createdAt');
					res.body.book.should.have.property('_id').eql(book.id);
					done();
				});
			});
		});
	});

	describe('/DELETE/:id book', () => {
		it('it should DELETE a book given the id', (done) => {
			let book = new Book({
				title: "El psicoanalista",
				author: "John Katzenbach",
				pages: 722,
				year: 2003
			});
			book.save((err, book) => {
				chai.request(server)
				.delete('/book/' + book.id)
				.send()
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Book successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
					done();
				});
			});
		});
	});


});