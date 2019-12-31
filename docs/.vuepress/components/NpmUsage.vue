<template>
  <div>
    <p v-if="loading">
      Loading...
    </p>

    <p v-if="rejected">
      Unable to get usage statistics for {{ routerName }}
    </p>

    <div v-if="success">
      <p>
        <b>Usage stats:</b> {{ usageCount }} downloads (measured every 15 days) <a target="_blank" :href="'https://www.npmtrends.com/' + routerName">see more</a>
      </p>
      <p>
        <b>Github stars:</b> {{ stars }}
      </p>
      <p v-if="usageCount < 100">
        <i>
          ⚠️ This package has a low usage and popularity statistic, and could be considered for removal. <a target="_blank" href="https://github.com/open-wc/open-wc/issues/new">Let us know about this</a>, so we can keep our recommendations up to date.
        </i>
      </p>
    </div>

  </div>
</template>

<script>

export default {
  name: "NpmUsage",
  props: {
    routerName: String
  },
  data() {
    return {
      loading: false,
      success: false,
      rejected: false,

      usageCount: 0,
      stars: 0,
    };
  },
  async mounted() {
    this.loading = true;

    try {
      const data = await fetch(`https://api.npms.io/v2/package/${encodeURIComponent(this.routerName)}`);
      const dataAsJson = await data.json();

      this.usageCount = dataAsJson.evaluation.popularity.downloadsCount.toFixed(0);
      this.stars = dataAsJson.collected.github 
        ? dataAsJson.collected.github.starsCount
        : 0;
  
      this.success = true;
    } catch (_) {
      this.rejected = true;
    }

    this.loading = false;
  }
};
</script>