import data from './data.json' assert { type: 'json' };

const applyCoupon = (items, campaign) => {
  const total = items.reduce((sum, i) => sum + i.price, 0);
  let discountedTotal;
  let percentageDiscount;
  if (!campaign) return total;

  if (campaign.type === "fixed") {
    discountedTotal = total - campaign.value;

    if (discountedTotal < 0) {
      discountedTotal = 0;
    }
  }

  if (campaign.type === "percentage") {
    percentageDiscount = total * (1 - campaign.value / 100);
  }

  const maxDiscount = discountedTotal > percentageDiscount ? discountedTotal : percentageDiscount;
  return  maxDiscount;
};

const applyOnTop = (items, total, campaign, points) => {
  let categoryDiscount = 0;
  let pointsDiscount = 0;

  if (campaign?.type === "category-percentage") {
    const categoryTotal = items
      .filter(i => i.category === campaign.category)
      .reduce((sum, i) => sum + i.price, 0);
    categoryDiscount = categoryTotal * (campaign.value / 100);
  }

  if (points > 0) {
    const maxPointDiscount = total * 0.2;
    pointsDiscount = points < maxPointDiscount ? points : maxPointDiscount;
  }

  const maxDiscount = categoryDiscount > pointsDiscount ? categoryDiscount : pointsDiscount;

  return total - maxDiscount;
};

const applySeasonal = (total, campaign) => {
  if (!campaign) return total;
  const seasonalTimes = parseInt(total / campaign.every);
  return total - (seasonalTimes * campaign.discount);
};

const calculateFinalPrice = (data) => {
  const { items, campaigns } = data;

  const afterCoupon = applyCoupon(items, campaigns.coupon);
  const afterOnTop = applyOnTop(items, afterCoupon, campaigns.onTop, campaigns.points);
  const finalPrice = applySeasonal(afterOnTop, campaigns.seasonal);

  return finalPrice.toFixed(2);
};

const result = calculateFinalPrice(data);
console.log("Final Price after discounted:", result, "THB");


