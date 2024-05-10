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
    
def get_groups_by_username_from_db(collection, username):
    results = collection.find(
        {'username': username},
        {'_id': 0, 'groups': 1}
    )
    return [result['groups'] for result in results]

def get_all_usernames_from_db(collection):
    usernames = collection.distinct('username')
    return usernames

def add_group_to_db(groups_collection, users_collection, group_name, admin_username, memebers_usernames):
    memebers_usernames = [admin_username] + memebers_usernames
    group_record = {
        'group_name': group_name,
        'admin_username': admin_username,
        'memebers_usernames': memebers_usernames
    }
    groups_collection.insert_one(group_record)
    
    for memeber_username in memebers_usernames:
        users_collection.update_one(
            {'username': memeber_username},
            {'$addToSet': {'groups': group_name}}
        )
    return
    
# def add_member_to_group(users_collection, groups_collection, group_name, member_username):
#     users_collection.update_one(
#         {'member_username': member_username},
#         {'$addToSet': {'group_name': group_name}}
#     )
#     groups_collection.update_one(
#         {'group_name': group_name},
#         {'$addToSet': {'memebers_usernames': member_username}}
#     )
#     return
