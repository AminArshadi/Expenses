def add_user_to_db(collection, firstName, lastName, email, username, password):
    user_record = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'username': username,
        'password': password
    }
    insert_result = collection.insert_one(user_record)
    return insert_result.inserted_id

def send_transaction_to_db(collection, username, amount, date, comments):
    transaction = {
        'date': date,
        'username': username,
        'amount': amount,
        'comments': comments
    }
    insert_result = collection.insert_one(transaction)
    return insert_result.inserted_id
