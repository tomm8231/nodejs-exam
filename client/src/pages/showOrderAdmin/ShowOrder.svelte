<script>
    let list = []

    const respnse = await fetch("http://localhost:8080/api/orders")
    const data = await response.json()
    list = data.data
</script>