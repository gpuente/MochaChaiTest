let mongoose = require('mongoose');
let Book = require('../models/book');

/*
* GET /book route to retrieve all the books
*/
function getBooks(req, res){
	let query = Book.find({});
	query.exec((err, books) => {
		if(err) return res.send(err);
		res.json(books);
	});
}


function postBook(req, res){
	var newBook = new Book(req.body);
	newBook.save((err, book) => {
		if(err) return res.send(err);
		res.json({message: "Book successfully added!", book})
	});
}


function getBook(req, res){
	Book.findById(req.params.id, (err, book) => {
		if(err) return res.send(err);
		res.json(book);
	});
}

function deleteBook(req, res){
	Book.remove({_id: req.params.id}, (err, result) => {
		if(err) return res.send(err);
		res.json({message: "Book successfully deleted!", result});
	});
}

function updateBook(req, res){
	
	Book.findById({_id: req.params.id}, (err, book) => {
		if(err) return res.send(err);
		Object.assign(book, req.body).save((err, book) =>{
			if(err) return res.send(err);
			res.json({message: "Book updated!", book})
		});
	});
	/*
	Book.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
		console.log(req.body);
		if(err) return res.send(err);
		res.json({message: "Book updated!", book});
	});*/
}

module.exports = {
	getBooks,
	postBook,
	getBook,
	deleteBook,
	updateBook
};
