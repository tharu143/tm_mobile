from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
import os
from werkzeug.utils import secure_filename
import time
from datetime import datetime, timedelta
import logging
import io
import openpyxl
from pymongo.errors import PyMongoError

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client['retail']
fs = GridFS(db)
products_collection = db['products']
mobiles_collection = db['mobiles']
accessories_collection = db['accessories']
sales_collection = db['sales']
customers_collection = db['customers']
settings_collection = db['settings']
print_collection = db['print']
stock_additions_collection = db['stock_additions']  # New collection for stock additions

UPLOAD_FOLDER = 'Uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
ALLOWED_EXCEL_EXTENSIONS = {'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def allowed_excel_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXCEL_EXTENSIONS

@app.route('/api/print', methods=['GET'])
def get_print_settings():
    try:
        print_settings = print_collection.find_one({"_id": "print_settings"})
        if print_settings:
            return jsonify({
                "shopName": print_settings.get("shopName", "Your Shop Name"),
                "address": print_settings.get("address", "123 Shop Street, City, Country"),
                "gstin": print_settings.get("gstin", "12ABCDE1234F1Z5")
            })
        else:
            return jsonify({
                "shopName": "Your Shop Name",
                "address": "123 Shop Street, City, Country",
                "gstin": "12ABCDE1234F1Z5"
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/print', methods=['POST'])
def save_print_settings():
    try:
        data = request.get_json()
        shop_name = data.get('shopName')
        address = data.get('address')
        gstin = data.get('gstin')

        if not shop_name or not address or not gstin:
            return jsonify({"error": "All fields are required"}), 400

        print_collection.update_one(
            {"_id": "print_settings"},
            {"$set": {
                "shopName": shop_name,
                "address": address,
                "gstin": gstin
            }},
            upsert=True
        )
        return jsonify({
            "shopName": shop_name,
            "address": address,
            "gstin": gstin,
            "message": "Print settings saved successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    try:
        settings = settings_collection.find_one({"key": "gst_settings"})
        if settings:
            return jsonify({
                "gstPercentage": settings.get("gstPercentage", 18),
                "enableGst": settings.get("enableGst", True)
            })
        return jsonify({"gstPercentage": 18, "enableGst": True})
    except Exception as e:
        logger.error(f"Error fetching settings: {e}")
        return jsonify({"error": "Failed to fetch settings"}), 500

@app.route('/api/settings', methods=['POST'])
def save_settings():
    try:
        data = request.json
        gst_percentage = float(data.get('gstPercentage', 18))
        enable_gst = data.get('enableGst', True)
        if gst_percentage < 0:
            return jsonify({"error": "GST percentage cannot be negative"}), 400

        settings_collection.update_one(
            {"key": "gst_settings"},
            {"$set": {"gstPercentage": gst_percentage, "enableGst": enable_gst}},
            upsert=True
        )
        return jsonify({
            "message": "Settings saved successfully",
            "gstPercentage": gst_percentage,
            "enableGst": enable_gst
        }), 200
    except Exception as e:
        logger.error(f"Error saving settings: {e}")
        return jsonify({"error": "Failed to save settings"}), 500

@app.route('/api/images/<image_id>')
def serve_image(image_id):
    try:
        if ObjectId.is_valid(image_id):
            image = fs.get(ObjectId(image_id))
            return image.read(), 200, {'Content-Type': image.content_type}
        else:
            return jsonify({"error": "Invalid image ID"}), 400
    except Exception as e:
        logger.error(f"Error serving image {image_id}: {e}")
        return jsonify({"error": "Image not found"}), 404

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = list(products_collection.find({}))
        for product in products:
            product['_id'] = str(product['_id'])
            product['image'] = None

            image_id_str = product.get('image_id')
            image_path_str = product.get('image_path')

            if image_id_str and ObjectId.is_valid(image_id_str):
                if fs.exists(ObjectId(image_id_str)):
                    product['image'] = f"/api/images/{image_id_str}"
                else:
                    logger.warning(f"GridFS file not found for image_id: {image_id_str}")
            elif image_path_str:
                static_file_full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path_str)
                if os.path.exists(static_file_full_path):
                    product['image'] = f"/Uploads/{image_path_str}"
                else:
                    logger.warning(f"Static file not found at {static_file_full_path}")

        return jsonify(products)
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/products', methods=['POST'])
def add_product():
    try:
        data = request.form.to_dict()
        name = data.get('name')
        price = float(data.get('price', 0))
        stock = int(data.get('stock', 0))
        category = data.get('category')
        supplier = data.get('supplier', '')
        min_stock = int(data.get('minStock', 5))
        barcode = data.get('barcode', f"BC{int(time.time())}")
        model = data.get('model', '')
        accessory_type = data.get('accessoryType', '')
        new_mobile = data.get('newMobile', '')
        new_accessory_name = data.get('newAccessoryName', '')
        new_accessory_model = data.get('newAccessoryModel', '')
        product_type = data.get('type', '')

        if not name or not category:
            return jsonify({"error": "Name and category are required"}), 400

        image_id = None
        image_path = None

        if 'image' in request.files:
            image_file = request.files['image']
            if image_file and image_file.filename != '' and allowed_file(image_file.filename):
                image_id = fs.put(image_file, filename=secure_filename(image_file.filename))
                image_path = secure_filename(image_file.filename)

        if category.lower() == "mobile" and new_mobile:
            existing_mobile = mobiles_collection.find_one({"name": new_mobile})
            if not existing_mobile:
                mobiles_collection.insert_one({"name": new_mobile, "category": "Mobile"})
            model = new_mobile

        if category.lower() == "accessories" and new_accessory_name and new_accessory_model:
            accessory_full_name = f"{new_accessory_model} - {new_accessory_name}"
            existing_accessory = accessories_collection.find_one({"accessoryName": new_accessory_name, "accessoryModel": new_accessory_model})
            if not existing_accessory:
                accessories_collection.insert_one({"accessoryName": new_accessory_name, "accessoryModel": new_accessory_model, "category": "Accessories"})
            accessory_type = accessory_full_name

        product_data = {
            "name": name,
            "price": price,
            "stock": stock,
            "category": category,
            "supplier": supplier,
            "minStock": min_stock,
            "barcode": barcode,
            "image_id": str(image_id) if image_id else None,
            "image_path": image_path,
            "model": model if category.lower() == "mobile" else "",
            "accessoryType": accessory_type if category.lower() == "accessories" else "",
            "type": product_type
        }
        products_collection.insert_one(product_data)

        # Log stock addition
        if stock > 0:
            stock_additions_collection.insert_one({
                "product_id": str(product_data['_id']),
                "quantity": stock,
                "date": datetime.utcnow().isoformat()
            })

        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        logger.error(f"Error adding product: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/products/<id>', methods=['PUT'])
def update_product(id):
    try:
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid product ID"}), 400

        data = request.form.to_dict()
        update_fields = {}

        if 'name' in data: update_fields['name'] = data['name'] or ''
        if 'price' in data: update_fields['price'] = float(data['price']) if data['price'] else 0
        if 'stock' in data: update_fields['stock'] = int(data['stock']) if data['stock'] else 0
        if 'category' in data: update_fields['category'] = data['category'] or ''
        if 'supplier' in data: update_fields['supplier'] = data['supplier'] or ''
        if 'minStock' in data: update_fields['minStock'] = int(data['minStock']) if data['minStock'] else 5
        if 'barcode' in data: update_fields['barcode'] = data['barcode'] or f"BC{int(time.time())}"
        if 'type' in data: update_fields['type'] = data['type'] or ''

        if 'image' in request.files:
            image_file = request.files['image']
            if image_file and image_file.filename != '' and allowed_file(image_file.filename):
                existing_product = products_collection.find_one({"_id": ObjectId(id)})
                if existing_product and 'image_id' in existing_product and existing_product['image_id'] and ObjectId.is_valid(existing_product['image_id']):
                    fs.delete(ObjectId(existing_product['image_id']))
                new_image_id = fs.put(image_file, filename=secure_filename(image_file.filename))
                update_fields['image_id'] = str(new_image_id)
                update_fields['image_path'] = secure_filename(image_file.filename)
        elif 'image_path' in data and data['image_path'] == '':
            existing_product = products_collection.find_one({"_id": ObjectId(id)})
            if existing_product and 'image_id' in existing_product and existing_product['image_id'] and ObjectId.is_valid(existing_product['image_id']):
                fs.delete(ObjectId(existing_product['image_id']))
            update_fields['image_id'] = None
            update_fields['image_path'] = None

        current_product = products_collection.find_one({"_id": ObjectId(id)})
        current_category = update_fields.get('category', current_product['category'])

        if current_category.lower() == "mobile":
            new_mobile = data.get('newMobile', '')
            if new_mobile:
                existing_mobile = mobiles_collection.find_one({"name": new_mobile})
                if not existing_mobile:
                    mobiles_collection.insert_one({"name": new_mobile, "category": "Mobile"})
                update_fields['model'] = new_mobile
            elif 'model' in data: update_fields['model'] = data['model'] or ''
            update_fields['accessoryType'] = ""
        elif current_category.lower() == "accessories":
            new_accessory_name = data.get('newAccessoryName', '')
            new_accessory_model = data.get('newAccessoryModel', '')
            if new_accessory_name and new_accessory_model:
                accessory_full_name = f"{new_accessory_model} - {new_accessory_name}"
                existing_accessory = accessories_collection.find_one({"accessoryName": new_accessory_name, "accessoryModel": new_accessory_model})
                if not existing_accessory:
                    accessories_collection.insert_one({"accessoryName": new_accessory_name, "accessoryModel": new_accessory_model, "category": "Accessories"})
                update_fields['accessoryType'] = accessory_full_name
            elif 'accessoryType' in data: update_fields['accessoryType'] = data['accessoryType'] or ''
            update_fields['model'] = ""
        else:
            update_fields['model'] = ""
            update_fields['accessoryType'] = ""

        # Check if stock is being updated and log the addition
        if 'stock' in update_fields and update_fields['stock'] != current_product['stock']:
            quantity_change = update_fields['stock'] - current_product['stock']
            if quantity_change > 0:
                stock_additions_collection.insert_one({
                    "product_id": id,
                    "quantity": quantity_change,
                    "date": datetime.utcnow().isoformat()
                })

        result = products_collection.update_one({"_id": ObjectId(id)}, {"$set": update_fields})
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"message": "Product updated successfully!"})
    except Exception as e:
        logger.error(f"Error updating product {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/products/<id>', methods=['DELETE'])
def delete_product(id):
    try:
        product = products_collection.find_one({"_id": ObjectId(id)})
        if not product:
            return jsonify({"error": "Product not found"}), 404
        if 'image_id' in product and product['image_id'] and ObjectId.is_valid(product['image_id']):
            fs.delete(ObjectId(product['image_id']))
        products_collection.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Product deleted successfully!"})
    except Exception as e:
        logger.error(f"Error deleting product {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/products/<id>/stock', methods=['PUT'])
def update_product_stock(id):
    try:
        data = request.get_json()
        new_stock = int(data.get('stock', 0))
        current_product = products_collection.find_one({"_id": ObjectId(id)})
        if not current_product:
            return jsonify({"error": "Product not found"}), 404

        quantity_change = new_stock - current_product['stock']
        if quantity_change > 0:
            stock_additions_collection.insert_one({
                "product_id": id,
                "quantity": quantity_change,
                "date": datetime.utcnow().isoformat()
            })

        result = products_collection.update_one({"_id": ObjectId(id)}, {"$set": {"stock": new_stock}})
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"message": "Stock updated successfully!"})
    except Exception as e:
        logger.error(f"Error updating stock for product {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/mobiles', methods=['GET'])
def get_mobiles():
    try:
        mobiles = list(mobiles_collection.find({}))
        for mobile in mobiles:
            mobile['_id'] = str(mobile['_id'])
        return jsonify(mobiles)
    except PyMongoError as e:
        logger.error(f"MongoDB error fetching mobiles: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error fetching mobiles: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/mobiles', methods=['POST'])
def add_mobile():
    try:
        data = request.form.to_dict()
        name = data.get('name')
        if not name:
            return jsonify({"error": "Mobile name is required"}), 400
        mobiles_collection.insert_one({"name": name, "category": "Mobile"})
        return jsonify({"message": "Mobile type added successfully!"}), 201
    except PyMongoError as e:
        logger.error(f"MongoDB error adding mobile: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error adding mobile: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/mobiles/<id>', methods=['PUT'])
def update_mobile(id):
    try:
        data = request.form.to_dict()
        name = data.get('name')
        if not name:
            return jsonify({"error": "Mobile name is required"}), 400
        result = mobiles_collection.update_one({"_id": ObjectId(id)}, {"$set": {"name": name}})
        if result.matched_count == 0:
            return jsonify({"error": "Mobile not found"}), 404
        return jsonify({"message": "Mobile type updated successfully!"})
    except PyMongoError as e:
        logger.error(f"MongoDB error updating mobile {id}: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error updating mobile {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/mobiles/<id>', methods=['DELETE'])
def delete_mobile(id):
    try:
        result = mobiles_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Mobile not found"}), 404
        return jsonify({"message": "Mobile type deleted successfully!"})
    except PyMongoError as e:
        logger.error(f"MongoDB error deleting mobile {id}: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error deleting mobile {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/accessories', methods=['GET'])
def get_accessories():
    try:
        accessories = list(accessories_collection.find({}))
        for accessory in accessories:
            accessory['_id'] = str(accessory['_id'])
        return jsonify(accessories)
    except PyMongoError as e:
        logger.error(f"MongoDB error fetching accessories: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error fetching accessories: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/accessories', methods=['POST'])
def add_accessory():
    try:
        data = request.form.to_dict()
        accessory_name = data.get('accessoryName')
        accessory_model = data.get('accessoryModel')
        category = data.get('category', 'Accessories')
        accessory_type_field = data.get('type', '')

        if not all([accessory_name, accessory_model]):
            return jsonify({"error": "Accessory name and model are required"}), 400

        existing_accessory = accessories_collection.find_one({"accessoryName": accessory_name, "accessoryModel": accessory_model})
        if existing_accessory:
            return jsonify({"error": "Accessory type with this name and model already exists"}), 400

        accessory_data = {
            'accessoryName': accessory_name,
            'accessoryModel': accessory_model,
            'category': category,
            'type': accessory_type_field
        }
        result = accessories_collection.insert_one(accessory_data)
        return jsonify({"message": "Accessory type added successfully!", "id": str(result.inserted_id)}), 201
    except PyMongoError as e:
        logger.error(f"MongoDB error adding accessory: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error adding accessory: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/accessories/<id>', methods=['PUT'])
def update_accessory(id):
    try:
        data = request.form.to_dict()
        accessory_name = data.get('accessoryName')
        accessory_model = data.get('accessoryModel')
        category = data.get('category', 'Accessories')
        accessory_type_field = data.get('type', '')

        if not all([accessory_name, accessory_model]):
            return jsonify({"error": "Accessory name and model are required"}), 400

        existing_accessory = accessories_collection.find_one({
            "accessoryName": accessory_name,
            "accessoryModel": accessory_model,
            "_id": {"$ne": ObjectId(id)}
        })
        if existing_accessory:
            return jsonify({"error": "Accessory type with this name and model already exists"}), 400

        update_data = {
            'accessoryName': accessory_name,
            'accessoryModel': accessory_model,
            'category': category,
            'type': accessory_type_field
        }
        result = accessories_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.matched_count == 0:
            return jsonify({"error": "Accessory not found"}), 404
        return jsonify({"message": "Accessory type updated successfully!"})
    except PyMongoError as e:
        logger.error(f"MongoDB error updating accessory {id}: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error updating accessory {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/accessories/<id>', methods=['DELETE'])
def delete_accessory(id):
    try:
        result = accessories_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Accessory not found"}), 404
        return jsonify({"message": "Accessory type deleted successfully!"})
    except PyMongoError as e:
        logger.error(f"MongoDB error deleting accessory {id}: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error deleting accessory {id}: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/images/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        if not ObjectId.is_valid(image_id):
            logger.error(f"Invalid ObjectId format for image_id: {image_id}")
            return jsonify({"error": "Invalid image ID format"}), 400
        
        file = fs.get(ObjectId(image_id))
        return send_file(io.BytesIO(file.read()), mimetype=file.content_type)
    except GridFS.errors.NoFile:
        logger.error(f"Image not found for image_id: {image_id}")
        return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        logger.error(f"Error serving image {image_id}: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/Uploads/<filename>')
def uploaded_file(filename):
    try:
        mimetype = None
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        if ext == 'png':
            mimetype = 'image/png'
        elif ext in ['jpg', 'jpeg']:
            mimetype = 'image/jpeg'
        elif ext == 'gif':
            mimetype = 'image/gif'
        if mimetype:
            return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), mimetype=mimetype)
        else:
            logger.error(f"Unsupported MIME type for file: {filename}")
            return jsonify({"error": "Unsupported image format"}), 400
    except FileNotFoundError:
        logger.error(f"File not found: {filename}")
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Error serving uploaded file {filename}: {e}")
        return jsonify({"error": "Failed to retrieve image"}), 500

@app.route('/api/sales', methods=['POST'])
def process_sale():
    try:
        data = request.json
        required_fields = ['customer', 'items', 'subtotal', 'tax', 'total', 'paymentMethod', 'timestamp', 'invoiceId', 'gstPercentage']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields for sale"}), 400

        customer = data['customer']
        items = data['items']
        gst_percentage = data['gstPercentage']

        for item in items:
            product = products_collection.find_one({"_id": ObjectId(item['id'])})
            if not product:
                return jsonify({"error": f"Product {item['name']} not found"}), 404
            if product['stock'] < item['quantity']:
                return jsonify({"error": f"Insufficient stock for {item['name']}. Available: {product['stock']}"}), 400

        for item in items:
            products_collection.update_one(
                {"_id": ObjectId(item['id'])},
                {"$inc": {"stock": -item['quantity']}}
            )

        customer_id = customer.get('id')
        if customer_id and ObjectId.is_valid(customer_id):
            customer_doc = customers_collection.find_one({"_id": ObjectId(customer_id)})
            if customer_doc:
                customers_collection.update_one(
                    {"_id": ObjectId(customer_id)},
                    {
                        "$inc": {"purchases": 1, "totalPurchases": data['total']},
                        "$set": {"lastPurchase": data['timestamp'][:10], "name": customer['name'], "phone": customer['phone']}
                    }
                )
            else:
                customer_id = None

        if not customer_id:
            new_customer = {
                'name': customer['name'],
                'phone': customer['phone'],
                'email': '', 'address': '', 'city': '', 'pincode': '', 'dateOfBirth': '',
                'purchases': 1, 'totalPurchases': data['total'], 'lastPurchase': data['timestamp'][:10], 'posBalance': 0
            }
            result = customers_collection.insert_one(new_customer)
            customer_id = str(result.inserted_id)

        sale_data = {
            'customer': {'id': customer_id, 'name': customer['name'], 'phone': customer['phone']},
            'items': items,
            'subtotal': data['subtotal'],
            'tax': data['tax'],
            'total': data['total'],
            'paymentMethod': data['paymentMethod'],
            'timestamp': data['timestamp'],
            'invoiceId': data['invoiceId'],
            'status': 'completed',
            'gstPercentage': gst_percentage
        }
        result = sales_collection.insert_one(sale_data)
        return jsonify({"message": "Sale processed successfully", "saleId": str(result.inserted_id)}), 201
    except Exception as e:
        logger.error(f"Error in process_sale: {e}")
        return jsonify({"error": "Failed to process sale"}), 500

@app.route('/api/sales', methods=['GET'])
def get_sales():
    try:
        sales = list(sales_collection.find())
        for sale in sales:
            sale['_id'] = str(sale['_id'])
            sale['timestamp'] = sale['timestamp'][:10]
        return jsonify(sales)
    except Exception as e:
        logger.error(f"Error in get_sales: {e}")
        return jsonify({"error": "Failed to retrieve sales records"}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        total_sales = sum(sale.get('total', 0) for sale in sales_collection.find())
        unique_customers_count = customers_collection.count_documents({})
        low_stock_count = products_collection.count_documents({"$expr": {"$lte": ["$stock", "$minStock"]}})
        today = datetime.utcnow().date().isoformat()
        today_sales = sum(sale.get('total', 0) for sale in sales_collection.find({"timestamp": {"$regex": f"^{today}"}}))
        return jsonify({
            "todaySales": today_sales,
            "totalCustomers": unique_customers_count,
            "lowStockItems": low_stock_count,
            "totalRevenue": total_sales
        })
    except Exception as e:
        logger.error(f"Error in get_dashboard_stats: {e}")
        return jsonify({"error": "Failed to retrieve dashboard statistics"}), 500

@app.route('/api/dashboard/recent-sales', methods=['GET'])
def get_recent_sales():
    try:
        recent_sales = list(sales_collection.find().sort("timestamp", -1).limit(4))
        now = datetime.utcnow()
        processed_sales = []
        for sale in recent_sales:
            try:
                if not all(key in sale for key in ['timestamp', 'items', 'customer', 'total']):
                    logger.warning(f"Skipping sale {sale.get('_id')} due to missing fields")
                    continue
                sale_time = datetime.fromisoformat(sale['timestamp'].replace('Z', '+00:00'))
                time_diff = now - sale_time
                if time_diff < timedelta(minutes=60):
                    time_str = f"{int(time_diff.total_seconds() // 60)} mins ago"
                elif time_diff < timedelta(hours=24):
                    time_str = f"{int(time_diff.total_seconds() // 3600)} hours ago"
                else:
                    time_str = f"{int(time_diff.total_seconds() // 86400)} days ago"
                processed_sale = {
                    '_id': str(sale['_id']),
                    'time': time_str,
                    'product': sale['items'][0]['name'] if sale['items'] else 'Unknown',
                    'amount': f"₹{sale['total']:.0f}",
                    'customer': sale['customer']['name'] if 'name' in sale['customer'] else 'Unknown',
                    'status': sale.get('status', 'completed')
                }
                processed_sales.append(processed_sale)
            except Exception as e:
                logger.error(f"Error processing sale {sale.get('_id')}: {e}")
        return jsonify(processed_sales)
    except Exception as e:
        logger.error(f"Error in get_recent_sales: {e}")
        return jsonify({"error": "Failed to retrieve recent sales"}), 500

@app.route('/api/dashboard/low-stock', methods=['GET'])
def get_low_stock():
    try:
        low_stock_items = list(products_collection.find(
            {"$expr": {"$lte": ["$stock", "$minStock"]}},
            {"name": 1, "stock": 1, "minStock": 1, "_id": 1, "image_id": 1, "image_path": 1}
        ).limit(4))
        for item in low_stock_items:
            item['_id'] = str(item['_id'])
            image_id_str = item.get('image_id')
            image_path_str = item.get('image_path')
            item['image'] = None

            if image_id_str and ObjectId.is_valid(image_id_str):
                try:
                    if fs.exists(ObjectId(image_id_str)):
                        item['image'] = f"/api/images/{image_id_str}"
                except Exception as e:
                    logger.warning(f"Error accessing GridFS for low stock item {item['_id']} (image_id: {image_id_str}): {e}")

            if item['image'] is None and image_path_str:
                if not image_path_str.startswith('/') and not image_path_str.startswith('http'):
                    static_file_full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path_str)
                    if os.path.exists(static_file_full_path):
                        item['image'] = f"/Uploads/{image_path_str}"
                elif image_path_str.startswith('/api/images/'):
                    item['image'] = image_path_str
                elif image_path_str.startswith('http'):
                    item['image'] = image_path_str

        return jsonify(low_stock_items)
    except Exception as e:
        logger.error(f"Error in get_low_stock: {e}")
        return jsonify({"error": "Failed to retrieve low stock items"}), 500

@app.route('/api/dashboard/restock', methods=['POST'])
def restock_low_stock():
    try:
        data = request.get_json() or {}
        restock_amount = int(data.get('restockAmount', 10))
        low_stock_items = list(products_collection.find({"$expr": {"$lte": ["$stock", "$minStock"]}}))
        
        if not low_stock_items:
            return jsonify({"message": "No low stock items to restock", "updatedItems": []}), 200

        updated_items = []
        for item in low_stock_items:
            new_stock = item['minStock'] + restock_amount
            result = products_collection.update_one(
                {"_id": item['_id']},
                {"$set": {"stock": new_stock}}
            )
            if result.matched_count > 0:
                stock_additions_collection.insert_one({
                    "product_id": str(item['_id']),
                    "quantity": restock_amount,
                    "date": datetime.utcnow().isoformat()
                })
                updated_items.append({
                    "_id": str(item['_id']),
                    "name": item['name'],
                    "oldStock": item['stock'],
                    "newStock": new_stock,
                    "minStock": item['minStock']
                })

        return jsonify({
            "message": f"Successfully restocked {len(updated_items)} items",
            "updatedItems": updated_items
        }), 200
    except Exception as e:
        logger.error(f"Error in restock_low_stock: {e}")
        return jsonify({"error": "Failed to restock items"}), 500

@app.route('/api/dashboard/restock-manual', methods=['POST'])
def restock_manual():
    try:
        data = request.get_json() or {}
        items = data.get('items', [])
        
        if not items:
            return jsonify({"error": "No items provided for restocking"}), 400

        updated_items = []
        errors = []
        for item in items:
            item_id = item.get('itemId')
            quantity = item.get('quantity')
            min_stock = item.get('minStock')

            if not ObjectId.is_valid(item_id):
                errors.append(f"Invalid item ID: {item_id}")
                continue

            if not isinstance(quantity, int) or quantity <= 0:
                errors.append(f"Invalid quantity for item ID {item_id}")
                continue

            update_fields = {"stock": quantity}
            if min_stock is not None:
                if not isinstance(min_stock, int) or min_stock < 1:
                    errors.append(f"Invalid minStock for item ID {item_id}")
                    continue
                update_fields['minStock'] = min_stock

            product = products_collection.find_one({"_id": ObjectId(item_id)})
            if not product:
                errors.append(f"Product not found for item ID {item_id}")
                continue

            quantity_change = quantity - product['stock']
            if quantity_change > 0:
                stock_additions_collection.insert_one({
                    "product_id": item_id,
                    "quantity": quantity_change,
                    "date": datetime.utcnow().isoformat()
                })

            result = products_collection.update_one(
                {"_id": ObjectId(item_id)},
                {"$set": update_fields}
            )
            if result.matched_count > 0:
                updated_items.append({
                    "_id": str(item_id),
                    "name": product['name'],
                    "oldStock": product['stock'],
                    "newStock": quantity,
                    "minStock": min_stock if min_stock is not None else product['minStock']
                })

        if errors:
            return jsonify({
                "message": f"Restocked {len(updated_items)} items with {len(errors)} errors",
                "updatedItems": updated_items,
                "errors": errors
            }), 200

        return jsonify({
            "message": f"Successfully restocked {len(updated_items)} items",
            "updatedItems": updated_items
        }), 200
    except Exception as e:
        logger.error(f"Error in restock_manual: {e}")
        return jsonify({"error": "Failed to restock items"}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    try:
        customers = list(customers_collection.find())
        for customer in customers:
            customer['_id'] = str(customer['_id'])
        return jsonify(customers)
    except Exception as e:
        logger.error(f"Error in get_customers: {e}")
        return jsonify({"error": "Failed to retrieve customers"}), 500

@app.route('/api/customers', methods=['POST'])
def add_customer():
    try:
        data = request.json
        name = data.get('name')
        phone = data.get('phone')
        if not all([name, phone]):
            return jsonify({"error": "Name and phone number are required"}), 400
        customer_data = {
            'name': name,
            'phone': phone,
            'email': data.get('email', ''),
            'address': data.get('address', ''),
            'city': data.get('city', ''),
            'pincode': data.get('pincode', ''),
            'dateOfBirth': data.get('dateOfBirth', ''),
            'purchases': data.get('purchases', 0),
            'totalPurchases': data.get('totalPurchases', 0),
            'lastPurchase': data.get('lastPurchase', datetime.utcnow().date().isoformat()),
            'posBalance': data.get('posBalance', 0)
        }
        result = customers_collection.insert_one(customer_data)
        customer_data['_id'] = str(result.inserted_id)
        return jsonify({"message": "Customer added successfully", "customer": customer_data}), 201
    except Exception as e:
        logger.error(f"Error in add_customer: {e}")
        return jsonify({"error": "Failed to add customer"}), 500

@app.route('/api/customers/<id>', methods=['PUT'])
def update_customer(id):
    try:
        data = request.json
        update_data = {
            'name': data.get('name', ''),
            'phone': data.get('phone', ''),
            'email': data.get('email', ''),
            'address': data.get('address', ''),
            'city': data.get('city', ''),
            'pincode': data.get('pincode', ''),
            'dateOfBirth': data.get('dateOfBirth', ''),
            'purchases': data.get('purchases', 0),
            'totalPurchases': data.get('totalPurchases', 0),
            'lastPurchase': data.get('lastPurchase', ''),
            'posBalance': data.get('posBalance', 0)
        }
        if not all([update_data['name'], update_data['phone']]):
            return jsonify({"error": "Name and phone number are required"}), 400
        result = customers_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.matched_count == 0:
            return jsonify({"error": "Customer not found"}), 404
        return jsonify({"message": "Customer updated successfully"})
    except Exception as e:
        logger.error(f"Error in update_customer: {e}")
        return jsonify({"error": "Failed to update customer"}), 500

@app.route('/api/customers/<id>', methods=['DELETE'])
def delete_customer(id):
    try:
        result = customers_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Customer not found"}), 404
        return jsonify({"message": "Customer deleted successfully"})
    except Exception as e:
        logger.error(f"Error in delete_customer: {e}")
        return jsonify({"error": "Failed to delete customer"}), 500

@app.route('/api/customers/search', methods=['GET'])
def search_customers():
    try:
        query = request.args.get('query', '')
        customers = list(customers_collection.find({
            '$or': [
                {'name': {'$regex': query, '$options': 'i'}},
                {'phone': {'$regex': query, '$options': 'i'}}
            ]
        }))
        for customer in customers:
            customer['_id'] = str(customer['_id'])
        return jsonify(customers)
    except Exception as e:
        logger.error(f"Error in search_customers: {e}")
        return jsonify({"error": "Failed to search customers"}), 500

@app.route('/api/export/mobiles', methods=['GET'])
def export_mobiles_to_excel():
    try:
        headers = [
            "Name", "Price (₹)", "Stock Quantity", "Category", "Supplier", "Minimum Stock Level",
            "Barcode", "Model", "Type (Brand/General Model)", "Image ID", "Image Path"
        ]
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Mobile Products Template"
        ws.append(headers)
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        return send_file(
            excel_file,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='mobile_products_template.xlsx'
        )
    except Exception as e:
        logger.error(f"Error in export_mobiles_to_excel: {e}")
        return jsonify({"error": "Failed to export mobile products template"}), 500

@app.route('/api/export/accessories', methods=['GET'])
def export_accessories_to_excel():
    try:
        headers = [
            "Name", "Price (₹)", "Stock Quantity", "Category", "Supplier", "Minimum Stock Level",
            "Barcode", "Type", "Accessory Type", "Image ID", "Image Path"
        ]
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Accessories Products Template"
        ws.append(headers)
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        return send_file(
            excel_file,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='accessory_products_template.xlsx'
        )
    except Exception as e:
        logger.error(f"Error in export_accessories_to_excel: {e}")
        return jsonify({"error": "Failed to export accessory products template"}), 500

@app.route('/api/import/products', methods=['POST'])
def import_products_from_excel():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not allowed_excel_file(file.filename):
        return jsonify({"error": "Invalid file type. Please upload an Excel file (.xlsx or .xls)"}), 400

    try:
        file_stream = io.BytesIO(file.read())
        wb = openpyxl.load_workbook(file_stream)
        sheet = wb.active
        headers = [cell.value for cell in sheet[1]]
        imported_count = 0
        errors = []

        expected_headers_map = {
            "name": "name",
            "price (₹)": "price",
            "stock quantity": "stock",
            "category": "category",
            "supplier": "supplier",
            "minimum stock level": "minStock",
            "barcode": "barcode",
            "model": "model",
            "type": "type",
            "accessory type": "accessoryType",
            "image id": "image_id",
            "image path": "image_path"
        }
        header_to_internal_key = {h.lower().strip(): expected_headers_map.get(h.lower().strip()) for h in headers if h}

        for row_idx, row in enumerate(sheet.iter_rows(min_row=2), start=2):
            row_values = [cell.value for cell in row]
            product_data = {}
            for header_key_excel, internal_key in header_to_internal_key.items():
                if internal_key:
                    try:
                        col_index = [h.lower().strip() for h in headers].index(header_key_excel)
                        if col_index < len(row_values):
                            product_data[internal_key] = row_values[col_index]
                    except ValueError:
                        continue

            try:
                product_data['name'] = str(product_data.get('name', '')).strip()
                if not product_data['name']:
                    errors.append(f"Row {row_idx}: Product Name is required")
                    continue

                product_data['price'] = float(product_data.get('price', 0) or 0)
                product_data['stock'] = int(product_data.get('stock', 0) or 0)
                product_data['category'] = str(product_data.get('category', '')).strip()
                product_data['supplier'] = str(product_data.get('supplier', '')).strip()
                product_data['minStock'] = int(product_data.get('minStock', 5) or 5)
                product_data['barcode'] = str(product_data.get('barcode', f"BC{int(time.time())}")).strip()
                
                product_data['image_id'] = str(product_data.get('image_id', '')).strip() or None
                product_data['image_path'] = str(product_data.get('image_path', '')).strip() or None

                if product_data['category'].lower() == "mobile":
                    model_val = str(product_data.get('model', '')).strip()
                    type_val = str(product_data.get('type', '')).strip()
                    if model_val:
                        product_data['model'] = model_val
                        if not mobiles_collection.find_one({"name": model_val}):
                            mobiles_collection.insert_one({"name": model_val, "category": "Mobile"})
                    else:
                        errors.append(f"Row {row_idx}: Mobile product requires a 'Model'")
                        continue
                    product_data['type'] = type_val
                    product_data['accessoryType'] = ''
                elif product_data['category'].lower() == "accessories":
                    accessory_type_val = str(product_data.get('accessoryType', '')).strip()
                    type_val = str(product_data.get('type', '')).strip()
                    if accessory_type_val:
                        product_data['accessoryType'] = accessory_type_val
                        acc_model, acc_name = ("", accessory_type_val)
                        if ' - ' in accessory_type_val:
                            parts = accessory_type_val.split(' - ', 1)
                            if len(parts) == 2:
                                acc_model, acc_name = parts
                        
                        if not accessories_collection.find_one({"accessoryName": acc_name, "accessoryModel": acc_model}):
                            accessories_collection.insert_one({
                                "accessoryName": acc_name,
                                "accessoryModel": acc_model,
                                "category": "Accessories",
                                "type": type_val
                            })
                    else:
                        errors.append(f"Row {row_idx}: Accessory product requires an 'Accessory Type'")
                        continue
                    product_data['model'] = ''
                    product_data['type'] = type_val
                else:
                    product_data['model'] = ''
                    product_data['accessoryType'] = ''
                    product_data['type'] = ''

                result = products_collection.insert_one(product_data)
                if product_data['stock'] > 0:
                    stock_additions_collection.insert_one({
                        "product_id": str(result.inserted_id),
                        "quantity": product_data['stock'],
                        "date": datetime.utcnow().isoformat()
                    })
                imported_count += 1
            except ValueError as ve:
                errors.append(f"Row {row_idx}: Data conversion error - {ve}")
            except Exception as e:
                errors.append(f"Row {row_idx}: Unexpected error - {e}")

        message = f"Successfully imported {imported_count} products"
        if errors:
            message += f". Errors: {'; '.join(errors)}"
            logger.error(f"Excel import errors: {errors}")
            return jsonify({"message": message, "errors": errors}), 200
        return jsonify({"message": message}), 200
    except Exception as e:
        logger.error(f"Error processing Excel file: {e}")
        return jsonify({"error": f"Failed to process Excel file: {e}"}), 500

# New Endpoints for Monthly and Yearly Stock Reports

def get_month_range(year, month):
    start = datetime(year, month, 1)
    if month == 12:
        end = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        end = datetime(year, month + 1, 1) - timedelta(days=1)
    return start, end

def get_year_range(year):
    start = datetime(year, 1, 1)
    end = datetime(year, 12, 31)
    return start, end

@app.route('/api/reports/monthly', methods=['GET'])
def get_monthly_report():
    try:
        year = int(request.args.get('year'))
        month = int(request.args.get('month'))
        start, end = get_month_range(year, month)
        
        # Sales aggregation
        sales_pipeline = [
            {"$match": {"timestamp": {"$gte": start.isoformat(), "$lte": end.isoformat()}}},
            {"$unwind": "$items"},
            {"$group": {
                "_id": "$items.id",
                "totalSold": {"$sum": "$items.quantity"},
                "totalRevenue": {"$sum": {"$multiply": ["$items.price", "$items.quantity"]}}
            }}
        ]
        sales_data = list(sales_collection.aggregate(sales_pipeline))
        for sale in sales_data:
            sale['_id'] = str(sale['_id'])
        
        # Stock additions aggregation
        additions_pipeline = [
            {"$match": {"date": {"$gte": start.isoformat(), "$lte": end.isoformat()}}},
            {"$group": {"_id": "$product_id", "totalAdded": {"$sum": "$quantity"}}}
        ]
        additions_data = list(stock_additions_collection.aggregate(additions_pipeline))
        for addition in additions_data:
            addition['_id'] = str(addition['_id'])
        
        # Current stock
        current_stock = list(products_collection.find({}, {"_id": 1, "stock": 1, "name": 1}))
        for stock in current_stock:
            stock['_id'] = str(stock['_id'])
        
        report = {
            "sales": sales_data,
            "additions": additions_data,
            "current_stock": current_stock,
            "period": f"{start.strftime('%B %Y')}"
        }
        return jsonify(report)
    except Exception as e:
        logger.error(f"Error generating monthly report: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/yearly', methods=['GET'])
def get_yearly_report():
    try:
        year = int(request.args.get('year'))
        start, end = get_year_range(year)
        
        # Sales aggregation
        sales_pipeline = [
            {"$match": {"timestamp": {"$gte": start.isoformat(), "$lte": end.isoformat()}}},
            {"$unwind": "$items"},
            {"$group": {
                "_id": "$items.id",
                "totalSold": {"$sum": "$items.quantity"},
                "totalRevenue": {"$sum": {"$multiply": ["$items.price", "$items.quantity"]}}
            }}
        ]
        sales_data = list(sales_collection.aggregate(sales_pipeline))
        for sale in sales_data:
            sale['_id'] = str(sale['_id'])
        
        # Stock additions aggregation
        additions_pipeline = [
            {"$match": {"date": {"$gte": start.isoformat(), "$lte": end.isoformat()}}},
            {"$group": {"_id": "$product_id", "totalAdded": {"$sum": "$quantity"}}}
        ]
        additions_data = list(stock_additions_collection.aggregate(additions_pipeline))
        for addition in additions_data:
            addition['_id'] = str(addition['_id'])
        
        # Current stock
        current_stock = list(products_collection.find({}, {"_id": 1, "stock": 1, "name": 1}))
        for stock in current_stock:
            stock['_id'] = str(stock['_id'])
        
        report = {
            "sales": sales_data,
            "additions": additions_data,
            "current_stock": current_stock,
            "period": f"{year}"
        }
        return jsonify(report)
    except Exception as e:
        logger.error(f"Error generating yearly report: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)