from fastapi import APIRouter, Depends, HTTPException

import deps
import schemas

# Create a router for the cart
router = APIRouter()


@router.get("/{cart_id}", response_model=schemas.Cart)
async def get_cart(cart_id: str, db=Depends(deps.get_db)):
    """
    Get all items in the cart.
    """
    cart_ref = db.collection("cart").document(cart_id)
    cart = cart_ref.get()
    if cart.exists:
        return schemas.Cart(**cart.to_dict())
    else:
        return schemas.Cart(id=cart_id, items=[])


@router.post("/{cart_id}", response_model=schemas.CartItem)
async def add_to_cart(
    cart_id: str, item: schemas.CartItemCreate, db=Depends(deps.get_db)
):
    """
    Add an item to the cart.
    """
    product_sku = item.product_sku
    quantity = item.quantity

    # check if the product exists
    product_ref = (
        db.collection("products").where("sku", "==", product_sku).limit(1)
    )
    product = product_ref.get()
    if len(product) == 0:
        raise HTTPException(status_code=404, detail="Product not found.")
    product_name = product[0].get("name")

    try:
        # Check if the product is already in the cart
        cart_ref = db.collection("cart").document(cart_id)
        cart = cart_ref.get()
        if cart.exists:
            cart_data = cart.to_dict()
            cart_items = cart_data.get("items", [])
            for cart_item in cart_items:
                if cart_item["product_sku"] == product_sku:
                    cart_item["quantity"] += quantity
                    cart_ref.update({"items": cart_items})
                    return schemas.CartItem(**cart_item)

            # If product is not found in cart, add it
            new_cart_item = {
                "product_sku": product_sku,
                "quantity": quantity,
                "product_name": product_name,
            }
            cart_ref.update({"items": cart_items + [new_cart_item]})
        else:
            # If the cart doesn't exist, create a new cart with the item
            new_cart_item = {
                "product_sku": product_sku,
                "quantity": quantity,
                "product_name": product_name,
            }
            cart_ref.set({"items": [new_cart_item]})
        return schemas.CartItem(**new_cart_item)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# @router.post("/", response_model=CartItem)
# async def add_to_cart(item: CartItem):
#     """
#     Add an item to the cart.
#     """
#     product_id = item.product_id
#     quantity = item.quantity

#     # Check if the product is already in the cart
#     cart_ref = db.collection("cart").where("product_id", "==", product_id).limit(1)
#     cart_items = cart_ref.get()

#     for cart_item in cart_items:
#         cart_item_ref = db.collection("cart").document(cart_item.id)
#         cart_item_ref.update({"quantity": cart_item.get("quantity") + quantity})
#         return CartItem(product_id=cart_item.get("product_id"), quantity=cart_item.get("quantity") + quantity)

#     # If the product is not in the cart, add it as a new item
#     new_cart_item = {"product_id": product_id, "quantity": quantity}
#     db.collection("cart").add(new_cart_item)
#     return new_cart_item


# @router.post("/", response_model=CartItem)
# async def add_to_cart(item: CartItem, current_user: dict = Depends(get_current_user)):
#     """
#     Add an item to the cart.
#     """
#     user_id = current_user["sub"]
#     product_id = item.product_id
#     quantity = item.quantity

#     # Get the user's cart
#     user_cart_ref = db.collection("cart").document(user_id)
#     user_cart = user_cart_ref.get()

#     # If the user's cart exists, update the quantity for the product
#     if user_cart.exists:
#         cart_data = user_cart.to_dict()
#         cart_products = cart_data.get("products", {})
#         cart_products[product_id] = cart_products.get(product_id, 0) + quantity
#         user_cart_ref.update({"products": cart_products})
#         return CartItem(product_id=product_id, quantity=cart_products[product_id])

#     # If the user's cart does not exist, create a new cart with the product
#     new_cart_data = {
#         "products": {product_id: quantity}
#     }
#     user_cart_ref.set(new_cart_data)
#     return CartItem(product_id=product_id, quantity=quantity)


# @router.post("/add_to_cart/{product_id}/{quantity}", status_code=201)
# async def add_product_to_cart(product_id: str, quantity: int):
#     """
#     Add a product to the cart with a specific quantity.
#     """
#     if quantity <= 0:
#         raise HTTPException(status_code=400, detail="Quantity must be greater than zero.")

#     product_ref = db.collection("products").document(product_id)
#     product = product_ref.get()
#     if not product.exists:
#         raise HTTPException(status_code=404, detail="Product not found.")

#     # Assuming you have some way to identify the user, you can use their user ID here
#     user_id = "some_user_id"  # Replace with the actual user ID

#     cart_ref = db.collection("carts").document(user_id)
#     cart = cart_ref.get()

#     if cart.exists:
#         # If the cart already exists for the user, update the cart with the new product and quantity
#         cart_data = cart.to_dict()
#         products_in_cart = cart_data.get("products", {})
#         current_quantity = products_in_cart.get(product_id, 0)
#         new_quantity = current_quantity + quantity
#         products_in_cart[product_id] = new_quantity
#         cart_ref.update({"products": products_in_cart})
#     else:
#         # If the cart doesn't exist for the user, create a new cart with the product and quantity
#         cart_data = {"products": {product_id: quantity}}
#         cart_ref.set(cart_data)

#     return {"message": f"{quantity} product(s) added to cart successfully."}


# @router.delete("/{product_id}", response_model=dict)
# async def remove_from_cart(product_id: int):
#     """
#     Remove an item from the cart by product ID.
#     """
#     cart_ref = db.collection("cart").where("product_id", "==", product_id).limit(1)
#     cart_items = cart_ref.get()

#     for cart_item in cart_items:
#         db.collection("cart").document(cart_item.id).delete()
#         return {"message": "Item removed from cart."}

#     raise HTTPException(status_code=404, detail="Item not found in cart.")
