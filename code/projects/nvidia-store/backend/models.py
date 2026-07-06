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


class OpenSourceModel(db.Model):
    __tablename__ = "open_source_models"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    developer_lab = db.Column(db.String(200), nullable=False)
    license = db.Column(db.String(100), nullable=False)
    param_count_billions = db.Column(db.Integer)
    context_window = db.Column(db.Integer)
    short_description = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "developer_lab": self.developer_lab,
            "license": self.license,
            "param_count_billions": self.param_count_billions,
            "context_window": self.context_window,
            "short_description": self.short_description,
            "required_memory_gb": (
                round(self.param_count_billions * 1 * 1.2)
                if self.param_count_billions is not None
                else None
            ),
        }
