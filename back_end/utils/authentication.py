def add_user_to_db(collection, firstName, lastName, email, username, password):
    user_record = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'username': username,
        'password': password,
        'groups': []
    }
    insert_result = collection.insert_one(user_record)
    return insert_result.inserted_id

# def add_group_to_db(collection, group_name, admin_username):
#     transaction = {
#         'group_name': group_name,
#         'admin_username': admin_username,
#         'memebers_username': [admin_username]
#     }
#     insert_result = collection.insert_one(transaction)
#     return insert_result.inserted_id

# def add_member_to_group(users_collection, groups_collection, group_name, member_username):
#     users_collection.update_one(
#         {'member_username': member_username},
#         {'$addToSet': {'group_name': group_name}}
#     )
#     groups_collection.update_one(
#         {'group_name': group_name},
#         {'$addToSet': {'memebers_username': member_username}}
#     )
#     return

def send_transaction_to_db(collection, username, amount, date, reason, comments):
    transaction = {
        'date': date,
        'username': username,
        'amount': amount,
        'reason': reason,
        'comments': comments
    }
    insert_result = collection.insert_one(transaction)
    return insert_result.inserted_id
