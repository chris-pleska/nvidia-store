from extensions import db


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price_usd = db.Column(db.Numeric(10, 2), nullable=False)
    power_watts = db.Column(db.Integer)
    vram_gb = db.Column(db.Integer)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    specs = db.Column(db.JSON)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price_usd": float(self.price_usd) if self.price_usd is not None else None,
            "power_watts": self.power_watts,
            "vram_gb": self.vram_gb,
            "description": self.description,
            "image_url": self.image_url,
            "specs": self.specs,
        }
