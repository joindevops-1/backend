// test/TransactionService.test.js
const chai = require('chai');
const sinon = require('sinon');
const mysql = require('mysql2');
const { expect } = chai;

const transactionService = require('../TransactionService');

describe('TransactionService', () => {
    let connection;
    let queryStub;

    beforeEach(() => {
        connection = {
            query: sinon.stub(),
            end: sinon.stub()
        };
        sinon.stub(mysql, 'createConnection').returns(connection);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should add a transaction successfully', () => {
        queryStub = connection.query.yields(null, { affectedRows: 1 });

        const result = transactionService.addTransaction(100, 'Test Transaction');
        expect(result).to.equal(200);
        expect(queryStub.calledOnce).to.be.true;
    });

    it('should get all transactions successfully', (done) => {
        const mockResults = [{ id: 1, amount: 100, description: 'Test Transaction' }];
        queryStub = connection.query.yields(null, mockResults);

        transactionService.getAllTransactions((results) => {
            expect(results).to.deep.equal(mockResults);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });

    it('should find a transaction by ID successfully', (done) => {
        const mockResult = [{ id: 1, amount: 100, description: 'Test Transaction' }];
        queryStub = connection.query.yields(null, mockResult);

        transactionService.findTransactionById(1, (result) => {
            expect(result).to.deep.equal(mockResult);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });

    it('should delete all transactions successfully', (done) => {
        queryStub = connection.query.yields(null, { affectedRows: 1 });

        transactionService.deleteAllTransactions((result) => {
            expect(result.affectedRows).to.equal(1);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });

    it('should delete a transaction by ID successfully', (done) => {
        queryStub = connection.query.yields(null, { affectedRows: 1 });

        transactionService.deleteTransactionById(1, (result) => {
            expect(result.affectedRows).to.equal(1);
            done();
        });

        expect(queryStub.calledOnce).to.be.true;
    });
});
