import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Bot,
  Wand2,
  Sparkles,
  CheckCircle,
  Star,
} from "lucide-react";
import type {
  Product,
  RecommendationRequest,
  Recommendation,
} from "../../types";
import { getPersonalizedTips } from "../../utils/recommendations";

interface AIRecommendationsPageProps {
  addToCart: (product: Product) => void;
  featuredProducts: Product[];
}

export function AIRecommendationsPage({
  addToCart,
  featuredProducts,
}: AIRecommendationsPageProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [recommendationForm, setRecommendationForm] =
    useState<RecommendationRequest>({
      skinType: "",
      concerns: [],
      budget: "",
      preferences: "",
      age: "",
      routine: "",
    });
  const navigate = useNavigate();

  const handleConcernToggle = (concern: string) => {
    setRecommendationForm((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    setRecommendations([]);
    try {
      const res = await fetch("http://localhost:5000/api/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_info: recommendationForm,
          products: featuredProducts,
        }),
      });
      const data = await res.json();
      if (data.recommendations) {
        // Response is already in the correct format: [{ product, reason, matchScore }]
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const resetForm = () => {
    setRecommendations([]);
    setRecommendationForm({
      skinType: "",
      concerns: [],
      budget: "",
      preferences: "",
      age: "",
      routine: "",
    });
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-pink-600 hover:text-pink-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Beauty Consultant
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your skin and beauty goals, and our AI will
              recommend the perfect products for you
            </p>
          </div>

          {!recommendations.length ? (
            <Card className="p-8">
              <div className="space-y-6">
                {/* Skin Type */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    What's your skin type?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Oily", "Dry", "Combination", "Sensitive"].map((type) => (
                      <Button
                        key={type}
                        variant={
                          recommendationForm.skinType === type
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setRecommendationForm((prev) => ({
                            ...prev,
                            skinType: type,
                          }))
                        }
                        className={
                          recommendationForm.skinType === type
                            ? "bg-pink-600 hover:bg-pink-700"
                            : ""
                        }
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Skin Concerns */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    What are your main skin concerns? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Acne",
                      "Dark spots",
                      "Wrinkles",
                      "Dryness",
                      "Dullness",
                      "Sensitivity",
                      "Large pores",
                      "Uneven tone",
                      "Fine lines",
                    ].map((concern) => (
                      <Button
                        key={concern}
                        variant={
                          recommendationForm.concerns.includes(concern)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleConcernToggle(concern)}
                        className={
                          recommendationForm.concerns.includes(concern)
                            ? "bg-pink-600 hover:bg-pink-700"
                            : ""
                        }
                      >
                        {concern}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    What's your age range?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["18-25", "26-35", "36-45", "45+"].map((age) => (
                      <Button
                        key={age}
                        variant={
                          recommendationForm.age === age ? "default" : "outline"
                        }
                        onClick={() =>
                          setRecommendationForm((prev) => ({ ...prev, age }))
                        }
                        className={
                          recommendationForm.age === age
                            ? "bg-pink-600 hover:bg-pink-700"
                            : ""
                        }
                      >
                        {age}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    What's your budget range?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Under $25", "$25-$50", "$50-$100", "$100+"].map(
                      (budget) => (
                        <Button
                          key={budget}
                          variant={
                            recommendationForm.budget === budget
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setRecommendationForm((prev) => ({
                              ...prev,
                              budget,
                            }))
                          }
                          className={
                            recommendationForm.budget === budget
                              ? "bg-pink-600 hover:bg-pink-700"
                              : ""
                          }
                        >
                          {budget}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    Any specific preferences?
                  </label>
                  <Textarea
                    placeholder="e.g., I prefer natural ingredients, I'm allergic to fragrance, I want cruelty-free products..."
                    value={recommendationForm.preferences}
                    onChange={(e) =>
                      setRecommendationForm((prev) => ({
                        ...prev,
                        preferences: e.target.value,
                      }))
                    }
                    className="min-h-[100px]"
                  />
                </div>

                {/* Current Routine */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    What's your current skincare routine?
                  </label>
                  <Textarea
                    placeholder="e.g., I wash my face twice daily, I use a moisturizer, I don't have a routine yet..."
                    value={recommendationForm.routine}
                    onChange={(e) =>
                      setRecommendationForm((prev) => ({
                        ...prev,
                        routine: e.target.value,
                      }))
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleGenerateRecommendations}
                  disabled={isGeneratingRecommendations}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 text-lg font-semibold"
                >
                  {isGeneratingRecommendations ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get My Personalized Recommendations
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Recommendations */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Your Personalized Recommendations
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-4">
                        <img
                          src={rec.product.image_url || "/placeholder.svg"}
                          alt={rec.product.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {rec.product.name}
                          </h3>
                          <p className="text-pink-600 font-medium">
                            {rec.product.brand}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(rec.product.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({rec.product.reviews})
                            </span>
                          </div>
                          <p className="font-bold text-lg text-gray-900 mt-2">
                            ${rec.product.price}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className="bg-green-100 text-green-700">
                              {rec.matchScore}% Match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {rec.reason}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleProductClick(rec.product)}
                            variant="outline"
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => addToCart(rec.product)}
                            className="flex-1 bg-pink-600 hover:bg-pink-700"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Personalized Tips */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Personalized Beauty Tips
                </h3>
                <div className="space-y-4">
                  {getPersonalizedTips(recommendationForm).map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="text-center">
                <Button onClick={resetForm} variant="outline" className="mr-4">
                  Get New Recommendations
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
