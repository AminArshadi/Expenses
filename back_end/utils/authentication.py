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

def send_transaction_to_db(collection, username, amount, date, reason, group, comments):
    transaction = {
        'date': date,
        'username': username,
        'amount': amount,
        'reason': reason,
        'group': group,
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

def add_group_to_db(groups_collection, users_collection, group_name, admin_username, members_usernames):
    members_usernames = [admin_username] + members_usernames
    group_record = {
        'group_name': group_name,
        'admin_username': admin_username,
        'members_usernames': members_usernames
    }
    groups_collection.insert_one(group_record)
    
    for member_username in members_usernames:
        users_collection.update_one(
            {'username': member_username},
            {'$addToSet': {'groups': group_name}}
        )
    return

def delete_group_from_db(groups_collection, users_collection, group_name, admin_username):
    # Step 1: Remove the group from the groups_collection
    delete_result = groups_collection.delete_one({'group_name': group_name, 'admin_username': admin_username})
    if delete_result.deleted_count == 0:
        return False, f"No group found with name '{group_name}' and admin '{admin_username}'"
    
    # Step 2: Remove the group name from the groups field of each user in the users_collection
    users_collection.update_many(
        {'groups': group_name},
        {'$pull': {'groups': group_name}}
    )
    return True, f"Group '{group_name}' successfully deleted."
    
    
# def add_member_to_group(users_collection, groups_collection, group_name, member_username):
#     users_collection.update_one(
#         {'member_username': member_username},
#         {'$addToSet': {'group_name': group_name}}
#     )
#     groups_collection.update_one(
#         {'group_name': group_name},
#         {'$addToSet': {'members_usernames': member_username}}
#     )
#     return
