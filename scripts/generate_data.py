import pandas as pd
import json
import os
from pathlib import Path
from datetime import datetime, timedelta
import random

def generate_sample_data():
    """Generate sample sales data for demonstration"""
    # Create sample sales data
    products = [
        "Laptop Pro", "Wireless Mouse", "Office Chair", "Standing Desk", 
        "Monitor 4K", "Keyboard Mechanical", "Desk Lamp", "Webcam HD",
        "USB Hub", "Headset Wireless"
    ]
    
    categories = ["Electronics", "Furniture", "Accessories"]
    
    data = []
    base_date = datetime(2024, 1, 1)
    
    for i in range(90):  # 90 days of data
        date = base_date + timedelta(days=i)
        daily_orders = random.randint(15, 45)
        
        for _ in range(daily_orders):
            product = random.choice(products)
            category = random.choice(categories)
            quantity = random.randint(1, 5)
            unit_price = random.uniform(25, 1200)
            
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "product": product,
                "category": category,
                "quantity": quantity,
                "unit_price": round(unit_price, 2),
                "revenue": round(quantity * unit_price, 2)
            })
    
    return pd.DataFrame(data)

def compute_kpis(df):
    """Compute main KPIs"""
    total_revenue = df['revenue'].sum()
    total_orders = len(df)
    aov = total_revenue / total_orders if total_orders > 0 else 0
    
    # Compute growth rates
    df_sorted = df.sort_values('date')
    mid_point = len(df_sorted) // 2
    first_half_revenue = df_sorted.iloc[:mid_point]['revenue'].sum()
    second_half_revenue = df_sorted.iloc[mid_point:]['revenue'].sum()
    growth_rate = ((second_half_revenue - first_half_revenue) / first_half_revenue * 100) if first_half_revenue > 0 else 0
    
    return {
        "revenue": round(total_revenue, 2),
        "orders": total_orders,
        "aov": round(aov, 2),
        "growth": round(growth_rate, 2)
    }

def compute_kpis_overview(df):
    """Compute detailed KPI overview"""
    total_revenue = df['revenue'].sum()
    total_orders = len(df)
    aov = total_revenue / total_orders if total_orders > 0 else 0
    
    # Daily revenue trends
    daily_revenue = df.groupby('date')['revenue'].sum().reset_index()
    daily_revenue['date'] = pd.to_datetime(daily_revenue['date'])
    
    # Best and worst days
    best_day = daily_revenue.loc[daily_revenue['revenue'].idxmax()]
    worst_day = daily_revenue.loc[daily_revenue['revenue'].idxmin()]
    
    # Growth trends
    recent_7_days = daily_revenue.tail(7)
    previous_7_days = daily_revenue.iloc[-14:-7]
    recent_7_revenue = recent_7_days['revenue'].sum()
    previous_7_revenue = previous_7_days['revenue'].sum()
    recent_growth = ((recent_7_revenue - previous_7_revenue) / previous_7_revenue * 100) if previous_7_revenue > 0 else 0
    
    # Product analysis
    product_revenue = df.groupby('product')['revenue'].sum().sort_values(ascending=False)
    top_product = product_revenue.head(1)
    concentration = (top_product.iloc[0] / total_revenue * 100) if total_revenue > 0 else 0
    
    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "avg_aov": round(aov, 2),
        "period_count": len(daily_revenue),
        "growth_trends": {
            "recent_7_days": round(recent_growth, 2),
            "overall_period": round(((daily_revenue.iloc[-1]['revenue'] - daily_revenue.iloc[0]['revenue']) / daily_revenue.iloc[0]['revenue'] * 100) if daily_revenue.iloc[0]['revenue'] > 0 else 0, 2)
        },
        "best_day": {
            "date": best_day['date'].strftime("%Y-%m-%d"),
            "revenue": round(best_day['revenue'], 2),
            "orders": len(df[df['date'] == best_day['date']])
        },
        "worst_day": {
            "date": worst_day['date'].strftime("%Y-%m-%d"),
            "revenue": round(worst_day['revenue'], 2),
            "orders": len(df[df['date'] == worst_day['date']])
        },
        "product_analysis": {
            "top_product": {
                "id": top_product.index[0],
                "revenue": round(top_product.iloc[0], 2)
            },
            "concentration_pct": round(concentration, 2)
        },
        "alerts_summary": {
            "total_alerts": 3,
            "high_severity": 1,
            "revenue_drops": 2
        }
    }

def compute_revenue_trend(df):
    """Compute daily revenue trend"""
    daily_revenue = df.groupby('date')['revenue'].sum().reset_index()
    daily_revenue['date'] = pd.to_datetime(daily_revenue['date'])
    daily_revenue = daily_revenue.sort_values('date')
    
    return [
        {
            "date": row['date'].strftime("%Y-%m-%d"),
            "revenue": round(row['revenue'], 2)
        }
        for _, row in daily_revenue.iterrows()
    ]

def compute_top_products(df):
    """Compute top products by revenue"""
    product_metrics = df.groupby('product').agg({
        'revenue': 'sum',
        'quantity': 'sum',
        'category': 'first'
    }).reset_index()
    
    product_metrics['avg_price'] = product_metrics['revenue'] / product_metrics['quantity']
    product_metrics = product_metrics.sort_values('revenue', ascending=False).head(10)
    
    return [
        {
            "product": row['product'],
            "revenue": round(row['revenue'], 2),
            "category": row['category'],
            "quantity": int(row['quantity']),
            "avg_price": round(row['avg_price'], 2)
        }
        for _, row in product_metrics.iterrows()
    ]

def compute_insights(df):
    """Generate business insights"""
    total_revenue = df['revenue'].sum()
    
    # Category performance
    category_revenue = df.groupby('category')['revenue'].sum()
    best_category = category_revenue.idxmax()
    
    # Revenue trends
    daily_revenue = df.groupby('date')['revenue'].sum()
    avg_daily_revenue = daily_revenue.mean()
    recent_avg = daily_revenue.tail(7).mean()
    trend_direction = "increasing" if recent_avg > avg_daily_revenue else "decreasing"
    
    # Product concentration
    product_revenue = df.groupby('product')['revenue'].sum()
    top_product = product_revenue.idxmax()
    top_product_share = (product_revenue.max() / total_revenue * 100) if total_revenue > 0 else 0
    
    insights = []
    insights.append(f"Best performing category is {best_category} with ${category_revenue.max():,.2f} in revenue")
    insights.append(f"Revenue trend is {trend_direction} over the last 7 days")
    insights.append(f"Top product {top_product} accounts for {top_product_share:.1f}% of total revenue")
    insights.append(f"Average daily revenue is ${avg_daily_revenue:,.2f}")
    insights.append(f"Product portfolio shows {'good' if top_product_share < 30 else 'high'} concentration risk")
    
    return {
        "summary": f"Sales dashboard shows {trend_direction} revenue trends with strong performance in {best_category}",
        "key_findings": insights
    }

def compute_alerts(df):
    """Generate business alerts"""
    alerts = []
    
    # Revenue drops
    daily_revenue = df.groupby('date')['revenue'].sum().sort_index()
    revenue_changes = daily_revenue.pct_change()
    
    # Find significant drops
    for date_str, change in revenue_changes.items():
        if change < -0.2:  # 20% drop
            date = pd.to_datetime(date_str)
            alerts.append({
                "type": "revenue_drop",
                "message": f"Revenue dropped {abs(change)*100:.1f}% on {date.strftime('%Y-%m-%d')}",
                "severity": "high" if change < -0.3 else "medium"
            })
    
    # Low order days
    daily_orders = df.groupby('date').size()
    low_order_days = daily_orders[daily_orders < daily_orders.quantile(0.2)]
    
    for date_str, orders in low_order_days.head(3).items():
        date = pd.to_datetime(date_str)
        alerts.append({
            "type": "low_orders",
            "message": f"Low order volume on {date.strftime('%Y-%m-%d')}: {orders} orders",
            "severity": "medium"
        })
    
    # High concentration alert
    product_revenue = df.groupby('product')['revenue'].sum()
    top_product_share = (product_revenue.max() / df['revenue'].sum() * 100)
    
    if top_product_share > 40:
        alerts.append({
            "type": "concentration_risk",
            "message": f"High revenue concentration: {product_revenue.idxmax()} accounts for {top_product_share:.1f}% of revenue",
            "severity": "high"
        })
    
    return alerts

def compute_analysis(df):
    """Generate comprehensive analysis"""
    total_revenue = df['revenue'].sum()
    
    # Product performance
    product_revenue = df.groupby('product')['revenue'].sum()
    best_product = product_revenue.idxmax()
    worst_product = product_revenue.idxmin()
    
    # Revenue trend analysis
    daily_revenue = df.groupby('date')['revenue'].sum().sort_index()
    if len(daily_revenue) >= 2:
        recent_trend = "upward" if daily_revenue.tail(7).mean() > daily_revenue.head(7).mean() else "downward"
    else:
        recent_trend = "stable"
    
    # Category analysis
    category_performance = df.groupby('category')['revenue'].sum()
    dominant_category = category_performance.idxmax()
    
    return {
        "best_product": best_product,
        "worst_product": worst_product,
        "trend": recent_trend,
        "dominant_category": dominant_category,
        "total_products": len(product_revenue),
        "avg_revenue_per_product": total_revenue / len(product_revenue),
        "revenue_volatility": daily_revenue.std() / daily_revenue.mean() if daily_revenue.mean() > 0 else 0
    }

def save_json(data, filename):
    """Save data to JSON file"""
    output_dir = Path(__file__).parent.parent / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    filepath = output_dir / filename
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Generated {filename}")

def main():
    """Main function to generate all data files"""
    print("🔄 Generating static data for sales analytics dashboard...")
    
    # Generate sample data
    df = generate_sample_data()
    print(f"Generated {len(df)} sample records")
    
    # Save raw data for reference
    output_dir = Path(__file__).parent.parent / "public" / "data"
    df.to_csv(output_dir / "raw_data.csv", index=False)
    
    # Compute and save all metrics
    kpis = compute_kpis(df)
    save_json(kpis, "kpis.json")
    
    kpis_overview = compute_kpis_overview(df)
    save_json(kpis_overview, "kpis_overview.json")
    
    revenue_trend = compute_revenue_trend(df)
    save_json(revenue_trend, "revenue_trend.json")
    
    top_products = compute_top_products(df)
    save_json(top_products, "top_products.json")
    
    insights = compute_insights(df)
    save_json(insights, "insights.json")
    
    alerts = compute_alerts(df)
    save_json(alerts, "alerts.json")
    
    analysis = compute_analysis(df)
    save_json(analysis, "analysis.json")
    
    print("✅ All data files generated successfully!")
    print(f"📁 Files saved to: {output_dir}")
    print("\n📊 Generated files:")
    for file in ["kpis.json", "kpis_overview.json", "revenue_trend.json", "top_products.json", "insights.json", "alerts.json", "analysis.json"]:
        print(f"   - {file}")

if __name__ == "__main__":
    main()
