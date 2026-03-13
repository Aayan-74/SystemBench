function calculateSecurityScore(registry) {
  const results = [];
  let totalScore = 0;
  let maxScore = 0;

  for (const rule of SECURITY_RULES) {
    maxScore += rule.weight;
    
    try {
      const passed = rule.check(registry);
      
      if (passed) {
        totalScore += rule.weight;
        results.push({
          id: rule.id,
          name: rule.description,
          category: rule.category,
          status: 'pass',
          severity: rule.severity,
          score: rule.weight,
          recommendation: '✓ Setting is properly configured'
        });
      } else {
        results.push({
          id: rule.id,
          name: rule.description,
          category: rule.category,
          status: 'fail',
          severity: rule.severity,
          score: 0,
          recommendation: rule.recommendation
        });
      }
    } catch (error) {
      results.push({
        id: rule.id,
        name: rule.description,
        category: rule.category,
        status: 'error',
        severity: rule.severity,
        score: 0,
        recommendation: 'Unable to verify setting'
      });
    }
  }

  const finalScore = Math.round((totalScore / maxScore) * 100);

  return {
    score: finalScore,
    totalWeight: totalScore,
    maxWeight: maxScore,
    results: results,
    riskLevel: getRiskLevel(finalScore),
    summary: generateSummary(results)
  };
}

function getRiskLevel(score) {
  if (score >= 85) return { level: 'Excellent', color: '#10b981' };
  if (score >= 70) return { level: 'Good', color: '#3b82f6' };
  if (score >= 55) return { level: 'Fair', color: '#f59e0b' };
  if (score >= 40) return { level: 'Poor', color: '#ef4444' };
  return { level: 'Critical', color: '#7f1d1d' };
}

function generateSummary(results) {
  const critical = results.filter(r => r.severity === 'critical' && r.status === 'fail').length;
  const high = results.filter(r => r.severity === 'high' && r.status === 'fail').length;
  
  return {
    criticalIssues: critical,
    highIssues: high,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length
  };
}
